import { z } from 'zod';

import { EventTypeEnum, RecurrenceTypeSchema } from '@/app/lib/enums/index';

export const baseCalendarEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  start: z.string(),
  end: z.string(),
  event_type: EventTypeEnum,
  description: z.string(),
  location: z.string(), //TODO: define a location type
  teams: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  notes: z.string(),

  recurrence_type: RecurrenceTypeSchema,
  recurrence_interval: z.number().min(1),
  recurrence_end: z.string().nullable(),
});

export type CalendarEvent = z.infer<typeof baseCalendarEventSchema>;
