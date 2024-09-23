import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function convertToClientTimezone(dateString: string): string {
  const utcDate = new Date(dateString);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localDate = toZonedTime(utcDate, timeZone);

  return format(localDate, 'yyyy-MM-dd HH:mm');
}

export default convertToClientTimezone;
