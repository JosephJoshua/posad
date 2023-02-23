import { onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref, StorageError } from 'firebase/storage';
import { collections, storage } from '../../../libs/firebase';
import { ExpiringProduct } from '../../../types';
import { handleStorageError } from '../../../libs/firebase';

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

export const getProductImageUrl = async (path: string): Promise<string> => {
  try {
    return await getDownloadURL(ref(storage, path));
  } catch (error) {
    if (error instanceof StorageError) handleStorageError(error);
    throw error;
  }
};
