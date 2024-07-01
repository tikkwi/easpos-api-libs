import { Period } from '@common/dto/entity.dto';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getPeriodDate = (period: Period, date: Date | Dayjs) => {
  const { days, hours, minutes, seconds } = period;
  return dayjs(date).add(dayjs.duration({ days, hours, minutes, seconds })).toDate();
};

export const isPeriodExceed = (period: Period, date: Date): [boolean, Date] => {
  const until = dayjs(getPeriodDate(period, date));
  return [until.isBefore(new Date()), until.toDate()];
};
