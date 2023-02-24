import {
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collections, storageRefs } from '../../../libs/firebase';
import { ExpiringProduct } from '../../../types';
import { handleStorageError } from '../../../libs/firebase';

export type ProductIdentifier = {
  sectionId: string;
  productId: string;
};

export type AddProductPayload = Omit<ExpiringProduct, 'id' | 'consumedAt'>;
export type EditProductPayload = Required<
  Pick<ExpiringProduct, 'id' | 'sectionId'>
> &
  Partial<Omit<ExpiringProduct, 'id' | 'sectionId'>>;

export type DeleteProductPayload = ProductIdentifier;
export type CompleteProductPayload = ProductIdentifier;

export type UploadProductImageResult = {
  path: string;
  url: string;
};

export const addProduct = async (uid: string, payload: AddProductPayload) => {
  return addDoc(collections.expiringProducts(uid, payload.sectionId), payload);
};

export const editProduct = async (uid: string, payload: EditProductPayload) => {
  /**
   * We don't want to allow the user to
   * update the section this product belongs to
   * with this API.
   */
  const { sectionId: _, ...data } = payload;

  return updateDoc(
    doc(collections.expiringProducts(uid, payload.sectionId), payload.id),
    data
  );
};

export const deleteProduct = async (
  uid: string,
  payload: DeleteProductPayload
) => {
  return deleteDoc(
    doc(collections.expiringProducts(uid, payload.sectionId), payload.productId)
  );
};

export const completeProduct = async (
  uid: string,
  payload: CompleteProductPayload
) => {
  return updateDoc(
    doc(
      collections.expiringProducts(uid, payload.sectionId),
      payload.productId
    ),
    {
      consumedAt: serverTimestamp(),
    }
  );
};

export const uploadProductImage = async (
  uid: string,
  file: File,
  onProgress: (progress: number) => void = () => null
): Promise<UploadProductImageResult> => {
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
      onProgress(progress);
    },
    (error) => handleStorageError(error)
  );

  const ref = (await task).ref;
  const url = await getDownloadURL(ref);

  return {
    path: ref.fullPath,
    url,
  };
};
