import { auth, collections } from '@posad/react-core/libs/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { handleAuthError } from './error';

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
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
