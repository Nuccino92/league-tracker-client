import { z } from 'zod';

export const statTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  sport_type: z.string(),
  description: z.string(),
  is_locked: z.boolean(),
  category: z.string().optional(),
});

export const sportInfoSchema = z.object({
  info: z.object({
    name: z.string(),
    value: z.string(),
  }),
  stat_categories: z.array(z.string()).nullable(),
  stats: z.array(statTypeSchema),
});

export const sportsListSchema = z.record(sportInfoSchema);

export type StatType = z.infer<typeof statTypeSchema>;
export type SportInfo = z.infer<typeof sportInfoSchema>;
export type SportsList = z.infer<typeof sportsListSchema>;
