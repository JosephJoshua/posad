import { collections } from '@posad/business-logic/libs/firebase';
import { ExpiringProductSection } from '@posad/business-logic/types';
import { addDoc, doc, updateDoc } from 'firebase/firestore';

export type AddSectionPayload = Omit<ExpiringProductSection, 'id'>;
export type EditSectionPayload = Required<Pick<ExpiringProductSection, 'id'>> &
  Partial<Omit<ExpiringProductSection, 'id'>>;

export const addSection = async (uid: string, payload: AddSectionPayload) => {
  return addDoc(collections.expiringProductSections(uid), payload);
};

export const editSection = async (uid: string, payload: EditSectionPayload) => {
  return updateDoc(
    doc(collections.expiringProductSections(uid), payload.id),
    payload
  );
};
