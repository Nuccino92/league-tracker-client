import { z } from 'zod';

export const playerInformationSchema = z.object({
  name: z.string().min(1, { message: 'The player name is required' }),
  avatar: z
    .string()
    .min(5)
    .max(255)
    .url({ message: 'The logo must be a URL' })
    .nullable(),
  // number: z.preprocess(
  //   (val) => (val === '' ? null : val),
  //   z.union([z.number(), z.null()])
  // ),
  // age: z
  //   .preprocess(
  //     (val) => (val === '' ? null : val),
  //     z.union([z.number(), z.null()])
  //   )
  //   .nullable(),
  email: z.string().email().nullable(),
  phoneNumber: z
    .string()
    .max(30, { message: "The phone number musn't exceed 30 characters" })
    .nullable(),
});

export type PlayerInformationResource = z.infer<typeof playerInformationSchema>;
