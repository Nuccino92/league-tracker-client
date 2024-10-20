import { z } from 'zod';
import { DaysOfWeekSchema } from '@/app/lib/enums/index';

export const generateGameScheduleSchema = z
  .object({
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    blackout_date: z.string().date(),

    max_games_per_day: z.number().min(1),
    max_games_per_team: z.number().min(1),
    games_per_team: z.number().min(1),

    balanced_matchups: z.boolean(), // Determines if teams should play eachother an even amount of times

    //could have timeperiods & also venue periods where i can add a venue, give it a time/date period and associate certain teams to these venues. everythign else would fall inside the base time period

    //TODO: possible couple time periods with days of week so that each day of weeks has its own time period
    timePeriods: z.array(
      z
        .object({
          start_time: z.string().time(),
          end_time: z.string().time(),
        })
        .refine((period) => period.start_time < period.end_time, {
          message: 'Start time must be before end time',
          path: ['start_time'],
        })
    ),

    daysOfWeek: z.array(DaysOfWeekSchema),
    frequency: z.enum(['daily', 'weekly', 'monthly']), //for each team
    frequency_number: z.number().min(1, { message: 'Minimum of 1' }), // times per frequency
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export type GenerateGameScheduleRequestData = z.infer<
  typeof generateGameScheduleSchema
>;
