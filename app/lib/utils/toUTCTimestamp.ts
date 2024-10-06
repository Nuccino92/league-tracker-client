import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export default function toUTCTimestamp(
  startDate: Date, // e.g., new Date("2024-10-01")
  startTime: string, // e.g., "12:15"
  clientTimeZone: string // e.g., "America/Toronto"
): string {
  const rawDateString = startDate.toISOString().split('T')[0]; // "2024-10-01"

  const dateString = `${rawDateString}T${startTime}:00`;

  const date = new Date(dateString);

  const zonedDate = toZonedTime(date, clientTimeZone);

  const utcIsoString = formatInTimeZone(
    zonedDate,
    'UTC',
    "yyyy-MM-dd'T'HH:mm:ssXXX"
  );

  return utcIsoString;
}
