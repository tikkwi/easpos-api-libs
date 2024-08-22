import { Period } from '@common/dto/entity.dto';
import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const $dayjs = dayjs;

$dayjs.extend(duration);

export const getPeriodDate = (period: Period, date: Date | Dayjs) => {
   const { days, hours, minutes, seconds } = period;
   return $dayjs(date).add($dayjs.duration({ days, hours, minutes, seconds })).toDate();
};

export const isPeriodExceed = (
   date: Date,
   period?: Period,
   offset?: number,
   unit?: ManipulateType,
) => {
   const until = $dayjs(period ? getPeriodDate(period, date) : date);
   const res = [until.isBefore(new Date()), until.toDate()];
   if (offset) res.push(until.subtract(offset, unit ?? 'days').isBefore(new Date()));
   return res;
};
