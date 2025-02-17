import { z } from 'zod';

export enum DefaultColors {
  Primary = '#00337C',
  Secondary = '#03C988',
}

export enum MemberRolesEnum {
  Owner = 'owner',
  'Super Admin' = 'super-admin',
  Admin = 'admin',
  'Team Manager' = 'team-manager',
  Scorekeeper = 'scorekeeper',
}

export enum RolePermissions {
  MANAGE_LEAGUE = 'manage_league', //owner only (monthly sub end, delete league)
  EDIT_LEAGUE_INFO = 'edit_league_info', //owner, super-admin only

  MANAGE_PLAYERS = 'manage_players', //manage players
  MANAGE_REGISTRATIONS = 'manage_registrations',
  MANAGE_NOTICES = 'manage_notices',
  MANAGE_SCHEDULE = 'manage_schedule',
  MANAGE_SEASONS = 'manage_seasons', //(add season, delete season, set active season, add/remove teams from season)

  MANAGE_ROSTER = 'manage_roster', //for season page
  MANAGE_TEAMS = 'manage_teams', //change teams info, (scoped), if scoped only allow editing scoped teams
}

export enum ControlPanelLeaguePages {
  INDEX = 'index',
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  SEASONS = 'seasons',
  TEAMS = 'teams',
  PLAYERS = 'players',
  SCHEDULE = 'schedule',
  REGISTRATIONS = 'registrations',
  NOTICES = 'notices',
  SETTINGS = 'settings',
}

export enum EventRecurrenceEnum {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export const RecurrenceTypeSchema = z.enum([
  'none',
  'daily',
  'weekly',
  'monthly',
]);
export type EventRecurrenceTypeEnum = z.infer<typeof RecurrenceTypeSchema>;

export const EventTypeEnum = z.enum(['game', 'practice', 'custom_event']);
export type EventType = z.infer<typeof EventTypeEnum>;

export const DaysOfWeekSchema = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);
export type DaysOfWeekEnum = z.infer<typeof DaysOfWeekSchema>;
