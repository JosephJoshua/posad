import dayjs from 'dayjs';
import { ExpiringProduct } from '../../../types';

export const isExpired = (expirationDate: Date) =>
  dayjs().isSameOrAfter(dayjs(expirationDate), 'day');

export const isProductExpired = (product: ExpiringProduct) => {
  const consumedOnTime = product.consumedAt != null && product.isOnTime;
  return isExpired(product.expirationDate.toDate()) && !consumedOnTime;
};
