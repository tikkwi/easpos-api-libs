import { Period } from '@common/dto/entity.dto';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getPeriodDate = (period: Period, date: Date | Dayjs) => {
   const { days, hours, minutes, seconds } = period;
   return dayjs(date).add(dayjs.duration({ days, hours, minutes, seconds })).toDate();
};

export const isPeriodExceed = (date: Date, period?: Period, offsetDay?: number) => {
   const until = dayjs(period ? getPeriodDate(period, date) : date);
   const res = [until.isBefore(new Date()), until.toDate()];
   if (offsetDay) res.push(until.subtract(offsetDay, 'days').isBefore(new Date()));
   return res;
};
