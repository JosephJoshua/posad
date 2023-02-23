import { Timestamp } from 'firebase/firestore';

export const ExpiringProductImageSources = ['user'] as const;

type ExpiringProduct = {
  id: string;
  sectionId: string;
  name: string;
  imageUrl: string;
  imageSource: (typeof ExpiringProductImageSources)[number];
  expirationDate: Timestamp;
  consumedAt?: Timestamp;
};

export default ExpiringProduct;
