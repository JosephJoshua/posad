import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';

export const initDayjs = () => {
  dayjs.extend(relativeTime);
  dayjs.extend(timezone);

  dayjs.tz.setDefault(dayjs.tz.guess());
};
