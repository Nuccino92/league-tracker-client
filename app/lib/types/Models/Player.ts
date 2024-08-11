import { nullable, z } from 'zod';

export const basePlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
});

export type BasePlayer = z.infer<typeof basePlayerSchema>;

export const playerSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  avatar: z
    .string()
    .min(5)
    .max(255)
    .url({ message: 'The logo must be a URL' })
    .nullable(),
  // number: z.number().nullable(),
  // age: z.number().nullable(),

  email: z.string().email().nullable(),
  phoneNumber: z
    .string()
    .max(30, { message: "The phone number musn't exceed 30 characters" })
    .nullable(),
});

export type Player = z.infer<typeof playerSchema>;
