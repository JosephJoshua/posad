import { VercelRequest, VercelResponse } from '@vercel/node';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import {
  getFirestore,
  Firestore,
  CollectionGroup,
  CollectionReference,
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
  USERS_COL,
} from '../../../libs/business-logic/src/constants';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { initDayjs } from '../../../libs/business-logic/src/libs/dayjs';

const generateExpiringMessages = async (
  db: Firestore,
  {
    startDate,
    endDate,
    usersCache,
  }: {
    startDate: Date;
    endDate: Date;
    usersCache: Map<string, Omit<User, 'id'>>;
  }
) => {
  const usersCollection = db.collection(USERS_COL) as CollectionReference<
    Omit<User, 'id'>
  >;

  const productsCollectionGroup = db.collectionGroup(
    EXPIRING_PRODUCTS_COL
  ) as CollectionGroup<Omit<ExpiringProduct, 'id'>>;

  const snap = await productsCollectionGroup
    .where('expirationDate', '>=', startDate)
    .where('expirationDate', '<=', endDate)
    .get();

  const messages = new Array<Message>();

  snap.docs.forEach(async (current) => {
    const data = current.data();
    const expiringIn = dayjs(data.expirationDate.toDate()).fromNow(true);

    const user = await (async () => {
      if (!usersCache.has(data.uid)) {
        const userDoc = await usersCollection.doc(data.uid).get();
        const userData = userDoc.data();

        if (userData == null) return null;
        usersCache.set(data.uid, userData);
      }

      return usersCache.get(data.uid);
    })();

    if (user == null) return;

    const newMessages = user.messagingTokens.map<Message>((token) => ({
      token,
      notification: {
        body: `${data.name} is expiring in ${expiringIn}. Go check on it now!`,
        title: `Expiring soon - ${data.name}`,
      },
    }));

    messages.push(...newMessages);
  });

  return messages;
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

  const users = new Map<string, Omit<User, 'id'>>();
  const messages = new Array<Message>();

  messages.push(
    ...(await generateExpiringMessages(db, {
      startDate: inOneWeek.add(1, 'day').startOf('day').toDate(),
      endDate: inOneMonth.endOf('day').toDate(),
      usersCache: users,
    }))
  );

  messages.push(
    ...(await generateExpiringMessages(db, {
      startDate: inThreeDays.add(1, 'day').startOf('day').toDate(),
      endDate: inOneWeek.endOf('day').toDate(),
      usersCache: users,
    }))
  );

  messages.push(
    ...(await generateExpiringMessages(db, {
      startDate: dayjs().startOf('day').toDate(),
      endDate: inThreeDays.endOf('day').toDate(),
      usersCache: users,
    }))
  );

  await messaging.sendAll(messages);
  res.status(200);
};

export default handler;
