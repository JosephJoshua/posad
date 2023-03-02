import dayjs from 'dayjs';

const roundDate = (date: Date, unit: 'day' | 'month'): Date => {
  switch (unit) {
    case 'day': {
      const d = dayjs(date).minute(0).second(0).millisecond(0).add(12, 'hours');
      return d.hour(0).toDate();
    }

    case 'month': {
      const d = dayjs(roundDate(date, 'day')).add(0.5, 'month');
      return d.date(0).toDate();
    }

    default:
      return date;
  }
};

export default roundDate;
