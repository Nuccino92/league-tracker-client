import { EventType } from '@/app/lib/types/Models/CalendarEvent';

export default function generateEventTitles({
  eventType,
  teamNames,
}: {
  eventType: EventType;
  teamNames: string[];
}): string {
  console.log();

  if (eventType === 'game') {
    return `Game: ${teamNames[0] ?? '___________'} vs ${teamNames[1] ?? '___________'}`;
  }

  if (eventType === 'practice') {
    return `Practice: ${teamNames[0] ?? '___________'}`;
  }

  return '';
}
