import * as yup from 'yup';

export const addProductFormSchema = yup.object({
  name: yup.string().required(),
  expirationDate: yup.date().required(),
});

export type AddProductFormValues = yup.InferType<typeof addProductFormSchema>;
