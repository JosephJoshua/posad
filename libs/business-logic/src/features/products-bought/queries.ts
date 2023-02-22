import { onSnapshot } from 'firebase/firestore';
import { collections } from '../../libs/firebase';
import { ExpiringProduct } from '../../types';

export const listenToProductsInSection = (
  uid: string,
  sectionId: string,
  callback: (data: ExpiringProduct[]) => void
) => {
  return onSnapshot(collections.expiringProducts(uid, sectionId), (snap) => {
    callback(
      snap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  });
};
