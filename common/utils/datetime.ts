import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Period } from '@common/dto/entity.dto';
import { ETime } from '@common/utils/enum';

export const $dayjs = dayjs;

$dayjs.extend(duration);

export const getPeriodDate = (period: Period, date?: Date | string | Dayjs) => {
   const { days, hours, minutes, seconds } = period;
   return $dayjs(date).add($dayjs.duration({ days, hours, minutes, seconds })).toDate();
};

export const isPeriodExceed = (
   date: Date | string,
   period?: Period,
   offset?: number,
   unit?: ManipulateType,
) => {
   const until = $dayjs(period ? getPeriodDate(period, date) : date);
   const res = [until.isBefore(new Date()), until.toDate()];
   if (offset) res.push(until.subtract(offset, unit ?? 'days').isBefore(new Date()));
   return res;
};

export const normalizeDate = (unit: ETime, amount: number) => {
   return $dayjs()
      .set('months', unit === ETime.Month ? amount : $dayjs().get('months'))
      .set('days', unit === ETime.Day ? amount : unit === ETime.Month ? 0 : $dayjs().get('days'))
      .set('hours', unit === ETime.Hour ? amount : 0)
      .set('minutes', 0)
      .set('seconds', 0);
};
