import { z } from 'zod';

export const organizationInformationSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'League name must be at least 5 characters' })
    .max(50, { message: 'Length must not exceed 50 characters' }),
  logo: z.string().url({ message: 'The logo must be a URL' }).nullable(), //TODO: make nullable
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(300, { message: 'Description must not exceed 300 characters' })
    .nullable(),
});

export type OrganizationInformationFormSchema = z.infer<
  typeof organizationInformationSchema
>;
