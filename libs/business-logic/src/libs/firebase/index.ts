import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  collectionGroup,
  CollectionReference,
  DocumentData,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getMessaging, getToken } from 'firebase/messaging';
import { ExpiringProduct, ExpiringProductSection, User } from '../../types';
import UserDataOrder from '../../types/UserDataOrder';
import { addMessagingToken } from '../../features/notifications/mutations';
import {
  EXPIRING_PRODUCTS_COL,
  EXPIRING_PRODUCT_SECTIONS_COL,
  USERS_COL,
  USER_DATA_ORDERS_COL,
} from '../../constants';

const config = {
  apiKey: 'AIzaSyD9gRTS4ogqkDA98AwCKpt4x6wp-OHXz_A',
  authDomain: 'posad-8e52c.firebaseapp.com',
  projectId: 'posad-8e52c',
  storageBucket: 'posad-8e52c.appspot.com',
  messagingSenderId: '525331637697',
  appId: '1:525331637697:web:2b2a4ddae6a4435dadbb40',
};

const firebase = initializeApp(config);

/**
 * -- Auth
 */
export const auth = getAuth(firebase);
export const googleProvider = new GoogleAuthProvider();

/**
 * -- Firestore
 */
export const db = getFirestore(firebase);

/**
 * @see https://plainenglish.io/blog/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099
 */
const createCollection = <T = DocumentData>(
  path: string,
  ...pathSegments: string[]
) => {
  return collection(db, path, ...pathSegments) as CollectionReference<T>;
};

const createCollectionGroup = <T = DocumentData>(id: string) => {
  return collectionGroup(db, id) as CollectionReference<T>;
};

export const collections = {
  users: createCollection<Omit<User, 'id'>>(USERS_COL),
  expiringProductSections: (userId: string) =>
    createCollection<Omit<ExpiringProductSection, 'id'>>(
      USERS_COL,
      userId,
      EXPIRING_PRODUCT_SECTIONS_COL
    ),
  expiringProducts: (userId: string, sectionId: string) =>
    createCollection<Omit<ExpiringProduct, 'id'>>(
      USERS_COL,
      userId,
      EXPIRING_PRODUCT_SECTIONS_COL,
      sectionId,
      EXPIRING_PRODUCTS_COL
    ),
  userDataOrders:
    createCollection<Omit<UserDataOrder, 'uid'>>(USER_DATA_ORDERS_COL),
};

export const collectionGroups = {
  expiringProducts: createCollectionGroup<Omit<ExpiringProduct, 'id'>>(
    EXPIRING_PRODUCTS_COL
  ),
};

/**
 * -- Cloud Storage
 */
export const storage = getStorage(firebase);
export const storageRefs = {
  expiringProductImages: (uid: string, imageId: string) =>
    ref(storage, `users/${uid}/expiring-product-images/${imageId}`),
};

/**
 * -- Cloud Messaging
 */
export const messaging = getMessaging(firebase);

export const requestForMessagingToken = () => {
  return getToken(messaging, {
    vapidKey:
      'BAK7mWPmC5y-3D58roOHd1WBIFT1_LPwTWDkVidLPjONmHitzOAaa1hrNnEJdXXVxU2pFu5uD3ODPzO5exw9la0',
  }).then((token) => {
    if (token) {
      const { currentUser } = auth;

      if (currentUser != null) addMessagingToken(currentUser.uid, token);
      return token;
    }

    return null;
  });
};

export * from './errors';
export default firebase;
