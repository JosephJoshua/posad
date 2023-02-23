import * as yup from 'yup';
import { ExpiringProductImageSources } from '../../types';

export const productEntryFormSchema = yup.object({
  name: yup.string().required(),
  expirationDate: yup.date().required(),
  image: yup
    .object({
      originalFileName: yup.string(),
      path: yup.string().required(),
      source: yup.string().oneOf(ExpiringProductImageSources).required(),
      url: yup.string().url().required(),
    })
    .required(),
});

export type ProductEntryFormValues = yup.InferType<
  typeof productEntryFormSchema
>;

export type ProductImageFormValue = ProductEntryFormValues['image'];
