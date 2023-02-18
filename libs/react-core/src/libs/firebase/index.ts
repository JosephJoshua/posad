import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  DocumentData,
  getFirestore,
} from 'firebase/firestore';
import { type User } from '@posad/react-core/types';

const config = {
  apiKey: 'AIzaSyD9gRTS4ogqkDA98AwCKpt4x6wp-OHXz_A',
  authDomain: 'posad-8e52c.firebaseapp.com',
  projectId: 'posad-8e52c',
  storageBucket: 'posad-8e52c.appspot.com',
  messagingSenderId: '525331637697',
  appId: '1:525331637697:web:2b2a4ddae6a4435dadbb40',
};

const firebase = initializeApp(config);

export const auth = getAuth(firebase);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(firebase);

/**
 * @see https://plainenglish.io/blog/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099
 */
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const collections = {
  users: createCollection<User>('users'),
};

export default firebase;
