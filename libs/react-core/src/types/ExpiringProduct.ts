import { Timestamp } from 'firebase/firestore';

type ExpiringProduct = {
  name: string;
  imageUrl: string;
  expirationDate: Timestamp;
  consumedAt?: Timestamp;
};

export default ExpiringProduct;
