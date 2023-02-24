import dayjs from 'dayjs';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { collectionGroups } from '../../libs/firebase';
import ExpiringProduct from '../../types/ExpiringProduct';

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
        snap.docs.reduce<ExpiringProduct[]>(
          (acc, doc) =>
            doc.data().consumedAt != null
              ? acc
              : acc.concat({
                  id: doc.id,
                  ...doc.data(),
                }),
          []
        )
      );
    }
  );
};

export const listenToProductsWentBadAggregation = (
  uid: string,
  callback: (data: ProductsWentBadDataPoint[]) => void
) => {
  return onSnapshot(
    query(
      collectionGroups.expiringProducts,
      where('uid', '==', uid),
      orderBy('expirationDate', 'asc')
    ),
    (snap) => {
      const products: Map<string, ExpiringProduct[]> = new Map();

      snap.docs.forEach((doc) => {
        const data = doc.data();
        const expirationDate = dayjs(data.expirationDate.toDate())
          .startOf('day')
          .format();

        const product = { ...data, id: doc.id };
        const target = products.get(expirationDate);

        if (target != null) {
          products.set(expirationDate, [...target, product]);
        } else {
          products.set(expirationDate, [product]);
        }
      });

      const result = Array.from(products.entries()).reduce<
        ProductsWentBadDataPoint[]
      >((acc, [date, products]) => {
        const wentBad = products.reduce<number>((acc, curr) => {
          const isExpired = dayjs().isSameOrAfter(
            dayjs(curr.expirationDate.toDate()),
            'day'
          );

          if (isExpired && curr.consumedAt == null) return acc + 1;
          return acc;
        }, 0);

        return acc.concat({
          qty: wentBad,
          date: dayjs(date).toDate(),
        });
      }, []);

      callback(result);
    }
  );
};
