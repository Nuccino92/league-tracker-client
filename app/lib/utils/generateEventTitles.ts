import { EventType } from '@/app/lib/enums/index';

export default function generateEventTitles({
  eventType,
  teamNames,
}: {
  eventType: EventType;
  teamNames: string[];
}): string {
  if (eventType === 'game') {
    return `Game: ${teamNames[0] ?? '___________'} vs ${teamNames[1] ?? '___________'}`;
  }

  if (eventType === 'practice') {
    return `Practice: ${teamNames[0] ?? '___________'}`;
  }

  return '';
}
