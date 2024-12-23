import { z } from 'zod';

import { League } from '@/app/lib/types/Models/League';
import { basePlayerSchema } from '@/app/lib/types/Models/Player';
import { baseTeamSchema } from '@/app/lib/types/Models/Team';
import { Season, seasonSchema } from '../Models/Season';
import { memberSchema } from '../Models/Member';
import { Role } from '../Models/Role';
import { registrationSchema } from '@/app/lib/types/Responses/registration';

// TODO: possibly seperate each region into its own file, follow the requests/control-panel folder structure

export type ControlPanelInformation = {
  league_info: League;
  seasons: Seasons;
  role: Role;
};

export type Seasons = {
  all_seasons: Season[];
  active_season_id: number | null;
};

// ---- region - seasons
export type ControlPanelArchivedSeasonsList = z.infer<typeof seasonSchema>;

export const controlPanelDetailedSeasonsListItemSchema = seasonSchema.merge(
  z.object({
    registrants: z.number(),
    teams: z.number(),
    players: z.number(),
    created_at: z.string(),
  })
);

export type ControlPanelDetailedSeasonsListItem = z.infer<
  typeof controlPanelDetailedSeasonsListItemSchema
>;

export const seasonSettingsSchema = z.object({
  registration_enabled: z.boolean(),
  registration_capacity: z.number(),
  max_players_per_team: z.number(),
  max_total_teams: z.number(),
  season: seasonSchema,
});
export type SeasonSettings = z.infer<typeof seasonSettingsSchema>;

// ---- end region

// TODO: possibly add can_remove property

// ---- region - teams
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
export const controlPanelCheckIfTeamIsInSeasonSchema = z.object({
  is_team_involved_in_season: z.boolean(),
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
export type ControlPanelCheckIfTeamIsInSeason = z.infer<
  typeof controlPanelCheckIfTeamIsInSeasonSchema
>;

// ---- endregion

// ---- region - players
export const controlPanelListPlayerSchema = basePlayerSchema;
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

// ---- region - members
export const controlPanelMemberForEdit = memberSchema.extend({
  id: z.number().nullable(),
});

export type ControlPanelMembersList = z.infer<typeof memberSchema>;
export type ControlPanelMemberForEdit = z.infer<
  typeof controlPanelMemberForEdit
>;
// ---- endregion

// ---- region - registrations
export const registrationItemSchema = registrationSchema;
export type RegistrationItem = z.infer<typeof registrationItemSchema>;

export const registrantItemSchema = z.object({
  id: z.number(),
  firstName: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .min(10, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^\d+$/, 'Phone number can only contain digits'),
  photo: z.string().max(500, 'Photo link is too long').optional(),
  // Optional emergency contact
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
  playerId: z.number().nullable(),
  payment: z
    .object({
      amount: z.number(),
      tax: z.number(),
      total: z.number(),
      currency: z.string(),
      status: z.enum(['succeeded', 'pending', 'failed']),
      created: z.string(),
      receipt_url: z.string().optional(),
    })
    .optional(),
  created_at: z.string(),
  season: z.object({
    id: z.number(),
    name: z.string(),
  }),
});
export type RegistrantItem = z.infer<typeof registrantItemSchema>;

export const createRegistrationFormSchema = z
  .object({
    seasonId: z
      .string({
        required_error: 'Please select a season',
      })
      .min(1, 'Please select a season'),
    description: z
      .string()
      .max(500, { message: 'The description must be less than 500 characters' })
      .optional(),
    price: z
      .number()
      .min(0, 'Price must be greater than or equal to 0')
      .or(z.string().regex(/^\d+$/).transform(Number)),
    openDate: z.date({ message: 'Please select a starting date' }),
    closeDate: z.date().nullable(),
  })
  .refine(
    (data) => {
      // Only validate dates if both are set
      if (data.openDate && data.closeDate) {
        return data.closeDate > data.openDate;
      }
      return true;
    },
    {
      message: 'Close date must be after open date',
      path: ['closeDate'],
    }
  );

export type CreateRegistrationFormValues = z.infer<
  typeof createRegistrationFormSchema
>;
// ---- endregion
