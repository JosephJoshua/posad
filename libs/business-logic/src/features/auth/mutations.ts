import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, WriteBatch, writeBatch } from 'firebase/firestore';
import { auth, collections, db, googleProvider } from '../../libs/firebase';
import { handleAuthError } from '../../libs/firebase';
import { INITIAL_PRODUCT_SECTION } from '../../types/ExpiringProductSection';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

const addInitialExpiringProductSection = (uid: string, batch: WriteBatch) => {
  batch.set(
    doc(collections.expiringProductSections(uid), INITIAL_PRODUCT_SECTION),
    {
      name: INITIAL_PRODUCT_SECTION,
    }
  );

  return batch.set(doc(collections.userDataOrders, uid), {
    expiringProductSections: [INITIAL_PRODUCT_SECTION],
  });
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
      const batch = writeBatch(db);

      batch.set(doc(collections.users, user.uid), {
        name: user.displayName ?? '',
        email: user.email ?? '',
        authProvider: 'google',
      });

      addInitialExpiringProductSection(user.uid, batch);
      await batch.commit();
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

    const batch = writeBatch(db);

    batch.set(doc(collections.users, uid), {
      name: credentials.name,
      email: credentials.email,
      authProvider: 'email',
    });

    addInitialExpiringProductSection(uid, batch);
    await batch.commit();
  } catch (err) {
    handleAuthError(err);
  }
};
