import { addDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadBytesResumable } from 'firebase/storage';
import { collections, storageRefs } from '../../libs/firebase';
import { ExpiringProduct } from '../../types';
import { handleStorageError } from '../../libs/firebase';

export type AddProductPayload = Omit<ExpiringProduct, 'id' | 'consumedAt'>;
export type DeleteProductPayload = {
  sectionId: string;
  productId: string;
};

export const addProduct = async (uid: string, payload: AddProductPayload) => {
  return addDoc(collections.expiringProducts(uid, payload.sectionId), payload);
};

export const deleteProduct = async (
  uid: string,
  payload: DeleteProductPayload
) => {
  return deleteDoc(
    doc(collections.expiringProducts(uid, payload.sectionId), payload.productId)
  );
};

export const uploadProductImage = async (
  uid: string,
  file: File
): Promise<string> => {
  const imageId = Date.now().toString();
  const extension = file.name.split('.').pop();

  const fileName = `${imageId}.${extension}`;
  const buffer = await file.arrayBuffer();

  const task = uploadBytesResumable(
    storageRefs.expiringProductImages(uid, fileName),
    buffer,
    {
      contentType: file.type,
    }
  );

  task.on(
    'state_changed',
    (snap) => {
      const progress = snap.bytesTransferred / snap.totalBytes;
      console.log(progress * 100);
    },
    (error) => handleStorageError(error)
  );

  return (await task).ref.fullPath;
};
