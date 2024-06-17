import { z } from 'zod';

import { League } from '@/app/lib/types/Models/League';
import { basePlayerSchema } from '@/app/lib/types/Models/Player';
import { baseTeamSchema } from '@/app/lib/types/Models/Team';
import { LeagueInformationResource } from '@/app/lib/types/Resources/CreateLeagueResource';

// TODO: possibly seperate each region into its own file, follow the requests/control-panel folder structure

export type ControlPanelInformation = {
  league_info: League;
  seasons: Seasons;
};

export type Seasons = {
  all_seasons: { id: number; name: string }[];
  active_season_id: number | null;
};

// TODO: possibly add can_remove property

// ----region - teams
export const controlPanelListTeamSchema = baseTeamSchema.merge(
  z.object({
    league_id: z.number(),
  })
);
export const controlPanelManageTeamSchema = baseTeamSchema.merge(
  z.object({
    is_in_active_season: z.boolean(),
    can_remove: z.boolean(),
  })
);
export const controlPanelArchivedTeamSchema = baseTeamSchema;
export const controlPaneListTeamForDropdownSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ControlPanelListTeam = z.infer<typeof controlPanelListTeamSchema>;
export type ControlPanelManageTeam = z.infer<
  typeof controlPanelManageTeamSchema
>;
export type ControlPanelArchivedTeam = z.infer<
  typeof controlPanelArchivedTeamSchema
>;
export type ControlPanelListTeamForDropdown = z.infer<
  typeof controlPaneListTeamForDropdownSchema
>;

// ---- endregion

// ---- region - players
export const controlPanelListPlayerSchema = basePlayerSchema.merge(
  z.object({ team: z.string().nullable() })
);
export const controlPanelArchivedPlayerSchema = basePlayerSchema;

export type ControlPanelListPlayer = z.infer<
  typeof controlPanelListPlayerSchema
>;
export type ControlPanelArchivedPlayer = z.infer<
  typeof controlPanelArchivedPlayerSchema
>;
// ---- endregion

export type ErrorType = 'inactive' | 'unauthorized';

export const organizationInformationSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'League name must be at least 5 characters' })
    .max(50, { message: 'Length must not exceed 50 characters' }),
  logo: z.string().url({ message: 'The logo must be a URL' }).nullable(),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(300, { message: 'Description must not exceed 300 characters' })
    .nullable(),
});

export type OrganizationInformationFormSchema = z.infer<
  typeof organizationInformationSchema
>;
