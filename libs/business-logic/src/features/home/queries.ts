import dayjs from 'dayjs';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { collectionGroups } from '../../libs/firebase';
import ExpiringProduct from '../../types/ExpiringProduct';
import { isProductExpired } from '../products-bought';

export type ProductsWentBadDataPoint = {
  qty: number;
  date: Date;
};

export const listenToExpiringProductsByExpirationDateAsc = (
  uid: string,
  callback: (products: ExpiringProduct[]) => void
) => {
  return onSnapshot(
    query(
      collectionGroups.expiringProducts,
      where('uid', '==', uid),
      orderBy('expirationDate', 'asc')
    ),
    (snap) => {
      callback(
        snap.docs.reduce<ExpiringProduct[]>((acc, doc) => {
          const product: ExpiringProduct = { id: doc.id, ...doc.data() };
          const includeProduct =
            !isProductExpired(product) && product.consumedAt == null;

          return includeProduct ? acc.concat(product) : acc;
        }, [])
      );
    }
  );
};

export const listenToProductsWentBadAggregation = (
  uid: string,
  startDateArg: Date,
  endDateArg: Date,
  groupBy: 'day' | 'month',
  callback: (data: ProductsWentBadDataPoint[]) => void
) => {
  const startDate = dayjs(startDateArg).startOf('day');
  const endDate = dayjs(endDateArg).endOf('day');

  return onSnapshot(
    query(
      collectionGroups.expiringProducts,
      where('uid', '==', uid),
      where('expirationDate', '>=', startDate.toDate()),
      where('expirationDate', '<=', endDate.toDate()),
      orderBy('expirationDate', 'asc')
    ),
    (snap) => {
      const getGroupKey = (date: dayjs.Dayjs) => {
        switch (groupBy) {
          case 'day':
            return date.format('DD-MM-YYYY');

          case 'month':
            return date.get('month');

          default:
            return 0;
        }
      };

      /**
       * Group products based on their expiration dates.
       */
      const products = snap.docs.reduce<Record<string, ExpiringProduct[]>>(
        (groups, current) => {
          const data = current.data();
          const key = getGroupKey(dayjs(data.expirationDate.toDate()));

          const product: ExpiringProduct = { id: current.id, ...data };

          return {
            ...groups,
            [key]: [...(groups[key] || []), product],
          };
        },
        {}
      );

      const result: ProductsWentBadDataPoint[] = [];
      let currentDate = startDate;

      /**
       * Generate a data point for every date in the date range.
       */
      while (endDate.isSameOrAfter(currentDate)) {
        const countExpired = (total: number, current: ExpiringProduct) => {
          if (isProductExpired(current)) return total + 1;
          return total;
        };

        const group = products[getGroupKey(currentDate)];
        const wentBad = group?.reduce<number>(countExpired, 0) ?? 0;

        result.push({
          qty: wentBad,
          date: currentDate.startOf(groupBy).toDate(),
        });

        currentDate = currentDate.add(1, groupBy);
      }

      callback(result);
    }
  );
};
