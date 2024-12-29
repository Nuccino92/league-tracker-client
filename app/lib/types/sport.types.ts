import { z } from 'zod';

export const sportSchema = z.enum([
  'basketball',
  'baseball',
  'soccer',
  'hockey',
  'curling',
  'football',
  'volleyball',
  'rugby',
  'lacross',
  'field-hockey',
]);

export type SportType = z.infer<typeof sportSchema>;
