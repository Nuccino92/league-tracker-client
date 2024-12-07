import { z } from 'zod';
import { DaysOfWeekSchema } from '@/app/lib/enums/index';

export const timeSlotsSchema = z.array(
  z
    .object({
      start_time: z.string().refine((value) => value.trim() !== '', {
        message: 'Please selected the start time',
      }),
      end_time: z.string().refine((value) => value.trim() !== '', {
        message: 'Please select the end time',
      }),
    })
    .refine(
      (period) =>
        period.start_time.trim() !== '' && period.end_time.trim() !== '',
      {
        message: 'Please select the time slots',
      }
    )
    .refine((period) => period.start_time < period.end_time, {
      message: 'The start time must be before end time',
      path: ['start_time'],
    })
);

export type TimeSlotSchemaType = z.infer<typeof timeSlotsSchema>;

export const gameScheduleFormSchema = z
  .object({
    start_date: z.date(),
    end_date: z.date(),
    blackout_dates: z.array(z.date()),

    number_of_games_per_team: z.number().min(1).max(50),
    games_per_day_limit: z.number().min(1).max(15),
    games_per_day_per_team_limit: z.number().min(1).max(5),

    balanced_matchups: z.boolean(), // Determines if teams should play eachother an even amount of times

    //could have timeSlotsSchema & also venue periods where i can add a venue, give it a time/date period and associate certain teams to these venues. everythign else would fall inside the base time period

    days_of_week: z.object({
      0: timeSlotsSchema.nullable().optional(),
      1: timeSlotsSchema.nullable().optional(),
      2: timeSlotsSchema.nullable().optional(),
      3: timeSlotsSchema.nullable().optional(),
      4: timeSlotsSchema.nullable().optional(),
      5: timeSlotsSchema.nullable().optional(),
      6: timeSlotsSchema.nullable().optional(),
    }),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export type GameScheduleForm = z.infer<typeof gameScheduleFormSchema>;

//TODO: determine what values backend would need
export const createGameScheduleSchema = z
  .object({
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    blackout_dates: z.array(z.string().date()),

    max_games_per_day: z.number().min(1).max(50),
    max_games_per_team: z.number().min(1).max(15),
    total_games_per_team: z.number().min(1).max(5),

    balanced_matchups: z.boolean(), // Determines if teams should play eachother an even amount of times

    //could have timeSlotsSchema & also venue periods where i can add a venue, give it a time/date period and associate certain teams to these venues. everythign else would fall inside the base time period

    days_of_week: z.object({
      0: timeSlotsSchema.nullable().optional(),
      1: timeSlotsSchema.nullable().optional(),
      2: timeSlotsSchema.nullable().optional(),
      3: timeSlotsSchema.nullable().optional(),
      4: timeSlotsSchema.nullable().optional(),
      5: timeSlotsSchema.nullable().optional(),
      6: timeSlotsSchema.nullable().optional(),
    }),

    daysOfWeek: z.array(DaysOfWeekSchema),
    frequency_type: z.enum(['daily', 'weekly', 'monthly']), //for each team
    frequency_amount: z.number().min(1, { message: 'Minimum of 1' }), // times per frequency
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export type CreateGameScheduleRequestData = z.infer<
  typeof createGameScheduleSchema
>;
