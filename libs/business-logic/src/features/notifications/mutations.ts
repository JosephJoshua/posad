import { collections } from '../../libs/firebase/index';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

export const addMessagingToken = (uid: string, token: string) => {
  return updateDoc(doc(collections.users, uid), {
    messagingTokens: arrayUnion(token),
  });
};
