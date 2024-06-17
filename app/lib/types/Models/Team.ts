import { z } from 'zod';

// TODO: possibly implement multiple team models for website/control-panel

export const baseTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullable(),
});

export type BaseTeam = z.infer<typeof baseTeamSchema>;

export const teamSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  logo: z.string().nullable(),
  description: z.string(),
  primary_color: z.string(),
  secondary_color: z.string(),
});

export type Team = z.infer<typeof teamSchema>;
