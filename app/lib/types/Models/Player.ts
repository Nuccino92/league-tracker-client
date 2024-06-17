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
  avatar: z.string().nullable(),
  number: z.number().nullable(),
  age: z.number().nullable(),
});

export type Player = z.infer<typeof playerSchema>;
