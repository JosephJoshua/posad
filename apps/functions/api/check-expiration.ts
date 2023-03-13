import { VercelRequest, VercelResponse } from '@vercel/node';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import {
  getFirestore,
  Firestore,
  CollectionGroup,
  CollectionReference,
  DocumentReference,
  WriteBatch,
  Timestamp,
} from 'firebase-admin/firestore';
import { getMessaging, Message } from 'firebase-admin/messaging';
import dayjs from 'dayjs';

/**
 * Vercel serverless functions don't support path mapping,
 * hence this workaround :(
 */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ExpiringProduct, User } from '../../../libs/business-logic/src/types';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  EXPIRING_PRODUCTS_COL,
  EXPIRING_PRODUCT_SECTIONS_COL,
  USERS_COL,
} from '../../../libs/business-logic/src/constants';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { initDayjs } from '../../../libs/business-logic/src/libs/dayjs';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  splitBatch,
  reduceBatch,
} from '../../../libs/business-logic/src/utils';

const fetchProducts = async (
  db: Firestore,
  {
    startDate,
    endDate,
    notNofiedInDays,
  }: {
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    notNofiedInDays?: number;
  }
) => {
  const productsCollectionGroup = db.collectionGroup(
    EXPIRING_PRODUCTS_COL
  ) as CollectionGroup<Omit<ExpiringProduct, 'id'>>;

  const snap = await productsCollectionGroup
    .where('isConsumed', '==', false)
    .where('expirationDate', '>=', startDate.startOf('day').toDate())
    .where('expirationDate', '<=', endDate.endOf('day').toDate())
    .get();

  const maxLastNotified = dayjs()
    .subtract(notNofiedInDays, 'days')
    .startOf('day');

  return snap.docs.reduce<ExpiringProduct[]>((acc, doc) => {
    const data = doc.data();
    const shouldIgnore =
      data.lastNotified != null &&
      dayjs(data.lastNotified.toDate()).isAfter(maxLastNotified);

    return shouldIgnore ? acc : acc.concat({ ...data, id: doc.id });
  }, []);
};

const fetchProductUsers = async (
  db: Firestore,
  { products }: { products: Omit<ExpiringProduct, 'id'>[] }
) => {
  const usersCollection = db.collection(USERS_COL) as CollectionReference<
    Omit<User, 'id'>
  >;

  /**
   * Get all unique user ids.
   */
  const userIds = Array.from(
    new Set<string>(products.map((product) => product.uid))
  );

  const users = new Map<string, Omit<User, 'id'>>();

  await Promise.all(
    userIds.map((uid) =>
      usersCollection
        .doc(uid)
        .get()
        .then((userDoc) => {
          users.set(uid, userDoc.data());
        })
    )
  );

  return users;
};

const generateExpiringMessages = async ({
  products,
  users,
}: {
  products: ExpiringProduct[];
  users: Map<string, Omit<User, 'id'>>;
}) => {
  const messages = new Array<Message>();

  products.forEach((product) => {
    const expiringIn = dayjs(product.expirationDate.toDate()).fromNow(true);

    const newMessages = users
      .get(product.uid)
      .messagingTokens.map<Message>((token) => ({
        token,
        notification: {
          body: `${product.name} is expiring in ${expiringIn}. Go check on it now!`,
          title: `Expiring soon - ${product.name}`,
        },
        webpush: {
          fcmOptions: {
            link: 'https://posad.vercel.app/products-bought',
          },
        },
      }));

    messages.push(...newMessages);
  });

  return messages;
};

const updateLastNotified = (
  db: Firestore,
  {
    products,
  }: {
    products: ExpiringProduct[];
  }
) => {
  const expiringProductDoc = (product: ExpiringProduct) => {
    const { uid, sectionId, id } = product;

    const path = [
      USERS_COL,
      uid,
      EXPIRING_PRODUCT_SECTIONS_COL,
      sectionId,
      EXPIRING_PRODUCTS_COL,
      id,
    ].join('/');

    return db.doc(path) as DocumentReference<Omit<ExpiringProduct, 'id'>>;
  };

  const now = Timestamp.fromDate(new Date());

  const result = reduceBatch<WriteBatch[], ExpiringProduct>(
    500,
    products,
    (acc, current) => {
      const batch = db.batch();

      current.forEach((product) => {
        const doc = expiringProductDoc(product);
        batch.update(doc, {
          lastNotified: now,
        });
      });

      return acc.concat(batch);
    },
    []
  );

  return result;
};

/**
 * Requires:
 *  > FIREBASE_CLIENT_EMAIL
 *  > FIREBASE_PRIVATE_KEY (FIREBASE_PRIVATE_KEY='"-----BEGIN PRIVATE KEY-----\nXXX\n-----END PRIVATE KEY-----"')
 * to be set.
 */
const handler = async (_: VercelRequest, res: VercelResponse) => {
  const PROJECT_ID = 'posad-8e52c';

  initDayjs();

  /**
   * @see https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
   */
  const app = initializeApp({
    /**
     * @see https://stackoverflow.com/questions/64073209/how-do-i-add-google-application-credentials-secret-to-vercel-deployment
     */
    credential: credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY || 'null'),
      projectId: PROJECT_ID,
    }),
    projectId: PROJECT_ID,
  });

  const db = getFirestore(app);
  const messaging = getMessaging(app);

  const inOneMonth = dayjs().add(1, 'month');
  const inOneWeek = dayjs().add(1, 'week');
  const inThreeDays = dayjs().add(3, 'days');
  const today = dayjs();

  const products = new Array<ExpiringProduct>();

  await Promise.all(
    [
      fetchProducts(db, {
        startDate: inOneWeek.add(1, 'day'),
        endDate: inOneMonth,
        notNofiedInDays: 30,
      }),
      fetchProducts(db, {
        startDate: inThreeDays.add(1, 'day'),
        endDate: inOneWeek,
        notNofiedInDays: 7,
      }),
      fetchProducts(db, {
        startDate: today,
        endDate: inThreeDays,
        notNofiedInDays: 1,
      }),
    ].map((promise) => promise.then((value) => products.push(...value)))
  );

  const users = await fetchProductUsers(db, { products });
  const messages = await generateExpiringMessages({
    products,
    users,
  });

  const batches = updateLastNotified(db, { products });
  const toSend = splitBatch(500, messages);

  await Promise.all(
    toSend.map((messages) =>
      messages.length > 0 ? messaging.sendAll(messages) : undefined
    )
  );

  await Promise.all(batches.map((batch) => batch.commit()));
  res.status(200).end();
};

export default handler;
