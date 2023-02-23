import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, collections, googleProvider } from '../../libs/firebase';
import { handleAuthError } from '../../libs/firebase';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export const loginWithCredentials = async (
  credentials: LoginCredentials
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  ).catch((error) => {
    handleAuthError(error);
    throw error;
  });
};

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

export const registerWithCredentials = async (
  credentials: RegisterCredentials
) => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const {
      user: { uid },
    } = result;

    await setDoc(doc(collections.users, uid), {
      name: credentials.name,
      email: credentials.email,
      authProvider: 'email',
    });
  } catch (err) {
    handleAuthError(err);
  }
};
