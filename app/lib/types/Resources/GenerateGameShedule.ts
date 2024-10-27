import { z } from 'zod';
import { DaysOfWeekSchema } from '@/app/lib/enums/index';

export const gameScheduleFormSchema = z
  .object({
    start_date: z.date(),
    end_date: z.date(),
    blackout_dates: z.array(z.date()),

    number_of_games_per_team: z.number().min(1),
    games_per_day_limit: z.number().min(1),
    games_per_day_per_team_limit: z.number().min(1),

    balanced_matchups: z.boolean(), // Determines if teams should play eachother an even amount of times

    //could have timeperiods & also venue periods where i can add a venue, give it a time/date period and associate certain teams to these venues. everythign else would fall inside the base time period

    //TODO: possible couple time periods with days of week so that each day of weeks has its own time period

    /**
     * TODO: POSSIBLY create a large object
     * each day (mon, tues, etc.)
     * - contains time period w/ venu and pref teams for this period
     * - example: I click monday, it opens a timeslot, i select timeslot and it gives me the option to select venue(s) & team(s)
     *
     * after timeslot it could be a refinement option
     */

    //@@@ IMPORTANT: COULD USE DayPicker mode="range"
    //https://daypicker.dev/docs/selection-modes#disabling-dates
    // timePeriods: z.array(
    //   z
    //     .object({
    //       start_time: z.string().time(),
    //       end_time: z.string().time(),
    //     })
    //     .refine((period) => period.start_time < period.end_time, {
    //       message: 'Start time must be before end time',
    //       path: ['start_time'],
    //     })
    // ),

    // daysOfWeek: z.array(DaysOfWeekSchema),
    // frequency_type: z.enum(['daily', 'weekly', 'monthly']), //for each team
    // frequency_amount: z.number().min(1, { message: 'Minimum of 1' }), // times per frequency
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export type GameScheduleForm = z.infer<typeof gameScheduleFormSchema>;

//TODO: add min/max validations w/ messages
export const createGameScheduleSchema = z
  .object({
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    blackout_dates: z.array(z.string().date()),

    max_games_per_day: z.number().min(1),
    max_games_per_team: z.number().min(1),
    total_games_per_team: z.number().min(1),

    balanced_matchups: z.boolean(), // Determines if teams should play eachother an even amount of times

    //could have timeperiods & also venue periods where i can add a venue, give it a time/date period and associate certain teams to these venues. everythign else would fall inside the base time period

    //TODO: possible couple time periods with days of week so that each day of weeks has its own time period

    /**
     * TODO: POSSIBLY create a large object
     * each day (mon, tues, etc.)
     * - contains time period w/ venu and pref teams for this period
     * - example: I click monday, it opens a timeslot, i select timeslot and it gives me the option to select venue(s) & team(s)
     *
     * after timeslot it could be a refinement option
     */

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
