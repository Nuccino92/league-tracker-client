import { z } from 'zod';
import { baseCalendarEventSchema } from '../Models/CalendarEvent';

export const calendarEventListItem = baseCalendarEventSchema;

export type CalendarEventListItem = z.infer<typeof calendarEventListItem>;

export type EventFormTypes = 'add' | 'edit';
