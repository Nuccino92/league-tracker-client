import { z } from 'zod';

export const createEventSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(50, { message: 'Title must not exceed 50 characters' }),
  start: z.string(), // Consider using z.date() if you want to validate date formats
  end: z.string(), // Same as above
  event_type: z.enum(['game', 'practice', 'custom']),
  description: z.string().optional(),
  location: z.string().optional(),
  teams: z
    .custom<string[]>((teams, ctx) => {
      const eventType = ctx.parent.event_type;

      // If event_type is 'game', teams is required
      if (eventType === 'game') {
        if (!teams || teams.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "teams is required when event_type is 'game'",
          });
        }
      }
      return true; // Always return true to indicate the validation check was successful
    })
    .optional(),
  notes: z.string().optional(),
});

export type CreateEvent = z.infer<typeof createEventSchema>;

export const eventFormSchema = z.object({
  event_type: z.string().nullable(),

  start_date: z.date(),
  start_time: z.string(),

  end_date: z.date().nullable(),
  end_time: z.string().nullable(),

  location: z.string().optional().or(z.literal('')),

  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(50, { message: 'Title must not exceed 50 characters' }),
  description: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(255, { message: 'Title must not exceed 50 characters' })
    .optional()
    .or(z.literal('')),
});

export type EventForm = z.infer<typeof eventFormSchema>;
