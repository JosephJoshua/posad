import * as yup from 'yup';
import { ExpiringProductImageSources } from '../../types';

export const addProductFormSchema = yup.object({
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

export type AddProductFormValues = yup.InferType<typeof addProductFormSchema>;
export type ProductImageFormValue = AddProductFormValues['image'];
