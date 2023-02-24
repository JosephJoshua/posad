import { doc, onSnapshot, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, StorageError } from 'firebase/storage';
import { collectionGroups, collections, storage } from '../../../libs/firebase';
import {
  ExpiringProduct,
  ExpiringProductSection,
  UserDataOrder,
} from '../../../types';
import { handleStorageError } from '../../../libs/firebase';

export type SectionWithProducts = ExpiringProductSection & {
  products: ExpiringProduct[];
};

export const listenToAllProducts = (
  uid: string,
  callback: (data: SectionWithProducts[]) => void
) => {
  let order: UserDataOrder | null = null;

  const sections: Map<string, Omit<ExpiringProductSection, 'id'>> = new Map();
  const products: ExpiringProduct[] = [];

  const onCallback = () => {
    const result: Map<string, SectionWithProducts> = new Map();

    order?.expiringProductSections.forEach((id) => {
      const section = sections.get(id);

      if (section == null) return;
      result.set(id, { ...section, id, products: [] });
    });

    products.forEach((product) => {
      result.get(product.sectionId)?.products.push(product);
    });

    callback(Array.from(result.values()));
  };

  return [
    onSnapshot(doc(collections.userDataOrders, uid), (snap) => {
      if (!snap.exists()) return;

      order = { uid, ...snap.data() };
      onCallback();
    }),
    onSnapshot(collections.expiringProductSections(uid), (snap) => {
      sections.clear();
      snap.docs.forEach((doc) => {
        sections.set(doc.id, doc.data());
      });

      onCallback();
    }),
    onSnapshot(
      query(collectionGroups.expiringProducts, where('uid', '==', uid)),
      (snap) => {
        products.splice(0, products.length);
        products.push(
          ...snap.docs.reduce<ExpiringProduct[]>(
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

        onCallback();
      }
    ),
  ];
};

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
