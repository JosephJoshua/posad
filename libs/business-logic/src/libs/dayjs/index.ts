import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export const initDayjs = () => {
  dayjs.extend(relativeTime);
  dayjs.extend(timezone);
  dayjs.extend(isSameOrAfter);

  dayjs.tz.setDefault(dayjs.tz.guess());
};
