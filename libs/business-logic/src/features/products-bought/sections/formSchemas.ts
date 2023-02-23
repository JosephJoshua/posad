import * as yup from 'yup';

export const sectionEntryFormSchema = yup.object({
  name: yup.string().required(),
});

export type SectionEntryFormValues = yup.InferType<
  typeof sectionEntryFormSchema
>;
