import { Timestamp } from 'firebase/firestore';

export const ExpiringProductImageSources = ['user'] as const;

type ExpiringProduct = {
  uid: string;
  id: string;
  sectionId: string;
  name: string;
  imageUrl: string;
  imageSource: (typeof ExpiringProductImageSources)[number];
  expirationDate: Timestamp;
  consumedAt?: Timestamp;
  isOnTime?: boolean;
};

export default ExpiringProduct;
