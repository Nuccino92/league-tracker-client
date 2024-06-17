import { z } from 'zod';

export const playerInformationSchema = z.object({
  name: z.string().min(1, { message: 'The player name is required' }),
  avatar: z
    .string()
    .min(5)
    .max(255)
    .url({ message: 'The logo must be a URL' })
    .nullable(),
  number: z.preprocess(
    (val) => (val === '' ? null : val),
    z.union([z.number(), z.null()])
  ),
  age: z.preprocess(
    (val) => (val === '' ? null : val),
    z.union([z.number(), z.null()])
  ),
});

export type PlayerInformationResource = z.infer<typeof playerInformationSchema>;
