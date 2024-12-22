import { nullable, z } from 'zod';

export const basePlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
  email: z.string().email().nullable(),
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
  emergencyContactName: z
    .string()
    .max(100, 'Emergency contact name is too long')
    .optional(),
  emergencyContactPhone: z
    .string()
    .max(15, 'Emergency contact phone is too long')
    .regex(/^\d+$/, 'Phone number can only contain digits')
    .optional()
    .nullable(),
});

export type Player = z.infer<typeof playerSchema>;
