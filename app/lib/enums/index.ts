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

export enum ControlPanelLeaguePages {
  INDEX = 'index',
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  SEASONS = 'seasons',
  TOURNAMENTS = 'tournaments',
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
