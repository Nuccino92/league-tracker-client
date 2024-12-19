import { z } from 'zod';

const leagueSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

const seasonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const registrationSchema = z.object({
  id: z.number(),
  league: leagueSchema,
  season: seasonSchema,
  price: z
    .number({
      required_error: 'Price is required',
    })
    .min(0, 'Price must be greater than or equal to 0'),
  openDate: z.string().refine((date) => {
    if (!date) return true;
    return !isNaN(Date.parse(date));
  }, 'Invalid date format'),
  closeDate: z
    .string()
    .nullable()
    .refine((date) => {
      if (!date) return true;
      return !isNaN(Date.parse(date));
    }, 'Invalid date format'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
});

export type Registration = z.infer<typeof registrationSchema>;
