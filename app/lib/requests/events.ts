import { z } from 'zod';

import ROUTES from '../globals/routes';
import { ErrorType } from '../types/Responses/control-panel.types';
import { calendarEventListItem } from '../types/Responses/events.types';
import { CalendarEvent } from '../types/Models/CalendarEvent';
import convertToClientTimezone from '../utils/convertToClientTimezone';

export async function getEvents({
  token,
  slug,
  teamSlugs,
}: {
  token: string;
  slug: string;
  teamSlugs?: string[];
}) {
  //TODO: pass in team slugs
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/events/league/${slug}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
    } as NotOk & { owner_id: string | undefined };

  const timezoneCorrectedEvents = data.data.map((event: CalendarEvent) => {
    return {
      ...event,
      start: convertToClientTimezone(event.start),
      end: convertToClientTimezone(event.end),
    };
  });

  return z
    .array(calendarEventListItem)
    .parse(timezoneCorrectedEvents) as CalendarEvent[];
}
