import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export const $dayjs = dayjs;

$dayjs.extend(duration);

// export const getPeriodDate = (period: Period, date?: Date | string | Dayjs) => {
//    const { days, hours, minutes, seconds } = period;
//    return $dayjs(date).add($dayjs.duration({ days, hours, minutes, seconds })).toDate();
// };
//
// export const isPeriodExceed = (
//    date: Date | string,
//    period?: Period,
//    offset?: number,
//    unit?: ManipulateType,
// ) => {
//    const until = $dayjs(period ? getPeriodDate(period, date) : date);
//    const res = [until.isBefore(new Date()), until.toDate()];
//    if (offset) res.push(until.subtract(offset, unit ?? 'days').isBefore(new Date()));
//    return res;
// };

export const isWithinPeriod = (from: string, to = '00:00:00:00:00', d?: Date) => {
   const [fM, fD, fh, fm] = from.split(':').map((e) => +e);
   const [tM, tD, th, tm] = to.split(':').map((e) => +e);
   const date = d ?? new Date();
   const [cM, cD, ch, cm] = [date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()];

   //NOTE: we'll only take account same year.. eg january don't consider as after february
   if (fM) {
      if (tM && tM > fM) return undefined;
      if (cM < fM || cM > tM) return false;
   }
   if (fD) {
      if (tD && tD > fD) return undefined;
      if (cD < fD || cD > tD) return false;
   }
   if (fh) {
      if (th && th > fh) return undefined;
      if (ch < fh || ch > th) return false;
   }
   if (fm) {
      if (tm && tm > fm) return undefined;
      if (cm < fm || cm > tm) return false;
   }

   return true;
};
