import { z } from 'zod';

export const leagueInformationSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'League name must be at least 5 characters' })
    .max(50, { message: 'Length must not exceed 50 characters' }),
  logo: z
    .string()
    .min(5)
    .max(255)
    .url({ message: 'The logo must be a URL' })
    .nullable(),
  // slug: z
  //   .string()
  //   .max(50, {
  //     message: 'The name inside the url must not exceed 50 characters',
  //   })
  //   .refine(
  //     (value) => {
  //       // Apply regex validation only if the field is not empty
  //       if (value.trim() !== '') {
  //         return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  //       }
  //       return true; // If field is empty, skip regex validation
  //     },
  //     {
  //       message: 'Only lowercase letters, numbers, and hyphens are allowed',
  //     }
  //   ),
  description: z
    .string()
    .max(300, { message: 'Description must not exceed 300 characters' })
    .refine((val) => val === '' || val.length >= 20, {
      message: 'Description must be at least 20 characters if provided',
    })
    .nullable(),
  primary_color: z
    .string()
    .min(5, { message: 'Must be a hex color code' })
    .max(50, { message: 'Must be a hex color code' }),
  secondary_color: z
    .string()
    .min(7, { message: 'Must be a hex color code' })
    .max(7, { message: 'Must be a hex color code' }),
});

export type LeagueInformationResource = z.infer<typeof leagueInformationSchema>;
