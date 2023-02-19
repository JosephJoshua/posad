import {
  auth,
  collections,
  googleProvider,
} from '@posad/react-core/libs/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleAuthError } from './error';

export const authenticateWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    const userDoc = await getDoc(doc(collections.users, user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(collections.users, user.uid), {
        name: user.displayName ?? '',
        email: user.email ?? '',
        authProvider: 'google',
      });
    }
  } catch (err) {
    handleAuthError(err);
  }
};
