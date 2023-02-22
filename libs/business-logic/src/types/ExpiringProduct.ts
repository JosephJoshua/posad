import { Timestamp } from 'firebase/firestore';

type ExpiringProduct = {
  id: string;
  sectionId: string;
  name: string;
  imageUrl: string;
  expirationDate: Timestamp;
  consumedAt?: Timestamp;
};

export default ExpiringProduct;
