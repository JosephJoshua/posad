import { Timestamp } from 'firebase/firestore';

type ExpiringProduct = {
  id: string;
  name: string;
  imageUrl: string;
  expirationDate: Timestamp;
  consumedAt?: Timestamp;
};

export default ExpiringProduct;
