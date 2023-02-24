import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { collectionGroups } from '../../libs/firebase';
import ExpiringProduct from '../../types/ExpiringProduct';

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
