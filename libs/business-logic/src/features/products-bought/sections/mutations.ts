import { collections, db } from '@posad/business-logic/libs/firebase';
import { ExpiringProductSection } from '@posad/business-logic/types';
import {
  arrayRemove,
  deleteDoc,
  doc,
  runTransaction,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

export type AddSectionPayload = Omit<ExpiringProductSection, 'id'>;
export type EditSectionPayload = Required<Pick<ExpiringProductSection, 'id'>> &
  Partial<Omit<ExpiringProductSection, 'id'>>;

export type DeleteSectionPayload = Pick<ExpiringProductSection, 'id'>['id'];

export const addSection = async (
  uid: string,
  sectionBeforeId: string,
  payload: AddSectionPayload
) => {
  return runTransaction(db, async (transaction) => {
    const orderDoc = doc(collections.userDataOrders, uid);
    const sectionDoc = doc(collections.expiringProductSections(uid));

    const sectionOrder = await transaction.get(orderDoc);
    transaction.set(sectionDoc, payload);

    const oldOrder = sectionOrder.data()?.expiringProductSections ?? [];
    const idx = oldOrder.findIndex((id) => id === sectionBeforeId);

    /**
     * Insert the new section at the index just after the id of the section before.
     */
    const newOrder = [...oldOrder];
    newOrder.splice(
      (idx === -1 ? newOrder.length - 1 : idx) + 1,
      0,
      sectionDoc.id
    );

    transaction.update(orderDoc, {
      expiringProductSections: newOrder,
    });
  });
};

export const editSection = async (uid: string, payload: EditSectionPayload) => {
  return updateDoc(
    doc(collections.expiringProductSections(uid), payload.id),
    payload
  );
};

export const deleteSection = async (
  uid: string,
  payload: DeleteSectionPayload
) => {
  const batch = writeBatch(db);

  batch.delete(doc(collections.expiringProductSections(uid), payload));
  batch.update(doc(collections.userDataOrders, uid), {
    expiringProductSections: arrayRemove(payload),
  });

  return batch.commit();
};
