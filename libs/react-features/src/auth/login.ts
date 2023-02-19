import {
  auth,
  collections,
  googleProvider,
} from '@posad/react-core/libs/firebase';
import {
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { handleAuthError } from './error';

export type LoginCredentials = {
  email: string;
  password: string;
};

export const loginWithCredentials = (
  credentials: LoginCredentials
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  ).catch((err) => handleAuthError(err));
};
