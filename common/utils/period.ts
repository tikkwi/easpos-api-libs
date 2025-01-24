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
   date: Date,
   period: string,
   validator: (d: number, p: number, i: number) => boolean | undefined,
) => {
   if (!isPeriod(period)) throw new BadRequestException('Invalid period');
   const pT = period.split(':');
   for (let i = pT.length - 1; i > 0; i--) {
      const f = +pT[i];
      const dT =
         i === 0
            ? date.getMinutes()
            : i === 1
              ? date.getHours()
              : i === 2
                ? date.getDate()
                : i === 3
                  ? date.getDay()
                  : date.getMonth();
      const res = validator(dT, f, i);
      if (res !== undefined) return res;
   }
   return true;
};

export const isBefore = (date: Date, period: string) =>
   matchDateWithPeriod(date, period, (d, p, i) => {
      if (d > p || (i === 0 && d === p)) return false;
      if (d < p) return true;
   });

export const isAfter = (date: Date, period: string) =>
   matchDateWithPeriod(date, period, (d, p, i) => {
      if (d < p || (i === 0 && d === p)) return false;
      if (d > p) return true;
   });

export const isDateWithinPeriod = (date: Date, pr: PeriodRange) => {
   validatePeriodRange(pr);
   if (isAfter(date, pr.from) && isBefore(date, pr.to)) return true;
   return false;
};
