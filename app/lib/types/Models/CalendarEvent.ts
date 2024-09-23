import { z } from 'zod';

export const baseCalendarEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  start: z.string(),
  end: z.string(),
  event_type: z.enum(['game', 'practice', 'custom_event']),
  description: z.string(),
  location: z.string(),
  teams: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  notes: z.string(),
});

export type CalendarEvent = z.infer<typeof baseCalendarEventSchema>;

export type EventType = 'game' | 'practice' | 'custom_event';
