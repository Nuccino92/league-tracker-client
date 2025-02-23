import { z } from 'zod';

export const tournamentFormatSchema = z.enum([
  'single_elimination',
  'double_elimination',
  'round_robin',
  'swiss',
  'group_knockout',
]);

export type TournamentFormat = z.infer<typeof tournamentFormatSchema>;

const tournamentTypeSchema = z.enum(['playoff', 'standalone']);
const tournamentStatusSchema = z.enum([
  'draft',
  'active',
  'completed',
  'cancelled',
]);
const tournamentStagesSchema = z.enum(['group', 'knockout']);

export const tournamentListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  format: tournamentFormatSchema,
  tournament_type: tournamentTypeSchema,
  season_id: z.number().nullable(),
  status: tournamentStatusSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type TournamentListItem = z.infer<typeof tournamentListItemSchema>;
