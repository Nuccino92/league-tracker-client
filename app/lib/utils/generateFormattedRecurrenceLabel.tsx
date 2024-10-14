import { EventRecurrenceTypeEnum } from '@/app/lib/enums/index';

type ParameterTypes = {
  interval: number;
  recurrenceType: EventRecurrenceTypeEnum;
};

export default function generateFormattedRecurrenceLabel({
  interval,
  recurrenceType,
}: ParameterTypes): string {
  if (recurrenceType === 'daily') {
    if (interval === 1) {
      return 'Daily';
    } else {
      return `Every ${interval} days`;
    }
  }

  if (recurrenceType === 'weekly') {
    if (interval === 1) {
      return 'Weekly';
    } else {
      return `Every ${interval} weeks`;
    }
  }

  if (recurrenceType === 'monthly') {
    if (interval === 1) {
      return 'Monthly';
    } else {
      return `Every ${interval} months`;
    }
  }

  return 'Does not repeat';
}
