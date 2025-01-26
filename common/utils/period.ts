import { PeriodRange } from '../dto/entity.dto';
import { isPeriod } from '../validator';
import { BadRequestException } from '@nestjs/common';

export const validatePeriodRange = ({ from, to }: PeriodRange) => {
   if (!isPeriod(from, false) || !isPeriod(to, false) || from === to)
      throw new BadRequestException('Invalid period range');
   const fT = from.split(':');
   const tT = to.split(':');
   for (let i = fT.length - 1; i > 0; i--) {
      const f = +fT[i],
         t = +tT[i];
      if (f > t) throw new BadRequestException('Invalid period range');
      if (f < t) break;
   }
   return true;
};

const matchDateWithPeriod = (
   period: string,
   validator: (d: number, p: number, i: number) => boolean | undefined,
   date?: Date,
) => {
   const $date = date ?? new Date();
   if (!isPeriod(period)) throw new BadRequestException('Invalid period');
   const pT = period.split(':');
   for (let i = pT.length - 1; i > 0; i--) {
      const f = +pT[i];
      const dT =
         i === 0
            ? $date.getMinutes()
            : i === 1
              ? $date.getHours()
              : i === 2
                ? $date.getDate()
                : i === 3
                  ? $date.getDay()
                  : $date.getMonth();
      const res = validator(dT, f, i);
      if (res !== undefined) return res;
   }
   return true;
};

export const isBefore = (period: string, date?: Date) =>
   matchDateWithPeriod(
      period,
      (d, p, i) => {
         if (d > p || (i === 0 && d === p)) return false;
         if (d < p) return true;
      },
      date,
   );

export const isAfter = (period: string, date?: Date) =>
   matchDateWithPeriod(
      period,
      (d, p, i) => {
         if (d < p || (i === 0 && d === p)) return false;
         if (d > p) return true;
      },
      date,
   );

export const isDateWithinPeriod = (pr: PeriodRange, date?: Date) => {
   validatePeriodRange(pr);
   if (isAfter(pr.from, date) && isBefore(pr.to, date)) return true;
   return false;
};
