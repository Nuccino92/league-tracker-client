import { z } from 'zod';

import { baseTeamSchema } from '@/app/lib/types/Models/Team';
import { EventTypeEnum, RecurrenceTypeSchema } from '@/app/lib/enums/index';

export const eventFormSchema = z.object({
  event_type: z.string().nullable(),

  start_date: z.date(),
  start_time: z.string(),

  end_date: z.date(),
  end_time: z.string(),

  location: z.string().optional().or(z.literal('')),

  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(50, { message: 'Title must not exceed 50 characters' }),
  description: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(500, { message: 'Description must not exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(500, { message: 'Description must not exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  teams: z.array(baseTeamSchema.omit({ logo: true })),
  lockedTeams: z.array(baseTeamSchema.omit({ logo: true })),

  recurrence_type: RecurrenceTypeSchema,
  recurrence_interval: z.number().min(1),
  recurrence_end: z.date().nullable(),
});

export type EventForm = z.infer<typeof eventFormSchema>;

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: 'Please enter an event title (min 2 characters)' })
      .max(50, { message: 'Title must not exceed 50 characters' }),
    start: z.string().datetime(),
    end: z.string().datetime(),
    event_type: EventTypeEnum,
    description: z
      .string()
      .min(5, { message: 'Description must be at least 5 characters' })
      .max(500, { message: 'Description must not exceed 500 characters' })
      .optional()
      .or(z.literal('')),
    location: z.string().optional(),
    teams: z.array(z.number()).nullable(),
    notes: z.string().optional(),

    recurrence_type: RecurrenceTypeSchema,
    recurrence_interval: z.number().min(1),
    recurrence_end: z.string().datetime().nullable(),
  })
  .refine(
    (data) =>
      data.event_type !== 'game' || (data.teams && data.teams.length === 2),
    {
      message: 'Please select both teams',
      path: ['teams'], // this ensures the error is mapped to the teams field
    }
  )
  .refine(
    (data) =>
      data.event_type === 'game' || (data.teams && data.teams.length > 0),
    {
      message: 'Please select a team',
      path: ['teams'],
    }
  );

export type CreateEvent = z.infer<typeof createEventSchema>;
