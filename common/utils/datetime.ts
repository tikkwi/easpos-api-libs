import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Period } from '@common/dto/global/entity.dto';

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

export const normalizeDate = (unit: 'h' | 'd' | 'm', amount: number) => {
   return $dayjs()
      .set('months', unit === 'm' ? amount : $dayjs().get('months'))
      .set('days', unit === 'd' ? amount : unit === 'm' ? 0 : $dayjs().get('days'))
      .set('hours', unit === 'h' ? amount : 0)
      .set('minutes', 0)
      .set('seconds', 0);
};
