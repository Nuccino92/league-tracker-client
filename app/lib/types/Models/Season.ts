import { z } from 'zod';

export const seasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
});

export type Season = z.infer<typeof seasonSchema>;
