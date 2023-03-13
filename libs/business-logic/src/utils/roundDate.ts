import dayjs from 'dayjs';

const roundDate = (date: Date, unit: 'day' | 'month'): Date => {
  switch (unit) {
    case 'day': {
      const d = dayjs(date).startOf('hour').add(0.5, 'days');
      return d.hour(0).toDate();
    }

    case 'month': {
      const d = dayjs(date).startOf('day').add(0.5, 'months');
      return d.date(0).toDate();
    }

    default:
      return date;
  }
};

export default roundDate;
