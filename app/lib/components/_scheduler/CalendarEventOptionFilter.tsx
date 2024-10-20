'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { EventType } from '@/app/lib/enums';
import useQueryString from '@/app/lib/hooks/useQueryString';

export default function CalendarEventOptionFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { isAdministrator } = useLeagueControlPanel();

  const { createQueryString } = useQueryString();

  const selectedEventTypes = searchParams.get('type')
    ? searchParams.get('type')
    : null;

  const [selectedTypesArray, setSelectedTypesArray] = useState(
    selectedEventTypes ? selectedEventTypes.split(',') : []
  );

  function handleEventOptionClick(eventType: EventType) {
    const isTypeSelected = selectedTypesArray.includes(eventType);

    let selectedTypesArrayCopy = [...selectedTypesArray];

    if (!isTypeSelected) {
      setSelectedTypesArray((prev) => [...prev, eventType]);
      selectedTypesArrayCopy.push(eventType);

      if (selectedTypesArrayCopy.length >= eventOptions.length) {
        setSelectedTypesArray([]);

        return router.push(
          pathname + '?' + createQueryString('type', undefined)
        );
      }
    } else {
      const filteredArray = selectedTypesArray.filter(
        (selection) => selection !== eventType
      );

      setSelectedTypesArray(filteredArray);
      selectedTypesArrayCopy = filteredArray;
    }

    const createdQueryString = createQueryString(
      'type',
      selectedTypesArrayCopy
    );

    const params = new URLSearchParams(createdQueryString);

    const url = pathname + '?' + params;

    router.push(url);
  }

  const eventOptions = [
    ...(isAdministrator()
      ? [
          {
            label: 'Game',
            value: 'game',
          },
        ]
      : []),
    {
      label: 'Practice',
      value: 'practice',
    },
    {
      label: 'Custom',
      value: 'custom_event',
    },
  ];

  return (
    <div>
      {' '}
      {eventOptions.map((event) => {
        const isEventTypeSelected = selectedTypesArray.includes(event.value);
        return (
          <button
            onClick={() => handleEventOptionClick(event.value as EventType)}
            type='button'
            key={event.value}
            className={classNames(
              isEventTypeSelected
                ? '!bg-secondary/10 text-secondary hover:!bg-secondary/10'
                : 'opacity-50',
              'h-10 w-max rounded px-3 py-2 text-sm font-medium transition-colors duration-75 hover:bg-gray-200'
            )}
          >
            {event.label}
          </button>
        );
      })}
    </div>
  );
}
