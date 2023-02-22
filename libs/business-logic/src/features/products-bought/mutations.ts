import { addDoc, deleteDoc, doc } from 'firebase/firestore';
import { collections } from '../../libs/firebase';
import { ExpiringProduct } from '../../types';

export type AddProductPayload = Omit<ExpiringProduct, 'id' | 'consumedAt'>;
export type DeleteProductPayload = {
  sectionId: string;
  productId: string;
};

export const addProduct = (uid: string, payload: AddProductPayload) => {
  return addDoc(collections.expiringProducts(uid, payload.sectionId), payload);
};

export const deleteProduct = (uid: string, payload: DeleteProductPayload) => {
  return deleteDoc(
    doc(collections.expiringProducts(uid, payload.sectionId), payload.productId)
  );
};
