'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import classNames from 'classnames';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import ListBox from '@/app/lib/components/Listbox';
import { EventType } from '@/app/lib/enums';
import useQueryString from '@/app/lib/hooks/useQueryString';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import TeamSelectionModal from '@/app/lib/components/TeamSelectionModal';

export default function LeagueCalendarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { leagueData, isAdministrator } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const { createQueryString } = useQueryString();

  const selectedEventTypes = searchParams.get('type')
    ? searchParams.get('type')
    : null;

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  const [selectedTypesArray, setSelectedTypesArray] = useState(
    selectedEventTypes ? selectedEventTypes.split(',') : []
  );

  const [showTeamSelectionModal, setShowTeamSelectionModal] = useState(false);

  //TODO: determine whether to show the filters inside a modal or to just display them plainly

  //Possibly add create schedule button which checks if a game is played or not. if not game has already been played allow the user to generate a schedule w/ the selected teams

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

  function handleEventOptionClick(eventType: EventType) {
    const isTypeSelected = selectedTypesArray.includes(eventType);

    let selectedTypesArrayCopy = [...selectedTypesArray];

    if (!isTypeSelected) {
      setSelectedTypesArray((prev) => [...prev, eventType]);
      selectedTypesArrayCopy.push(eventType);

      if (selectedTypesArrayCopy.length >= eventOptions.length) {
        console.log('am i here');
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

  return (
    <div className='flex items-center justify-between border-b p-8'>
      <h1 className='text-xl font-bold'>Calendar</h1>

      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2 text-sm'>
          <span>Season:</span>
          <ListBox
            rootClasses='w-max !text-xs'
            value={selectedSeason ? selectedSeason.toString() : null}
            onChange={(value) =>
              router.push(
                pathname + '?' + createQueryString('season', value?.toString())
              )
            }
            buttonText={
              seasons.all_seasons.find((season) => season.id === selectedSeason)
                ?.name ?? 'Select a Season'
            }
            options={[
              ...transformIntoOptions(seasons.all_seasons, {
                labelKey: 'name',
                valueKey: 'id',
              }),
            ]}
          />
        </div>
        <div className='space-x-1'>
          {eventOptions.map((event) => {
            const isEventTypeSelected = selectedTypesArray.includes(
              event.value
            );
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

        <Button type='button' onClick={() => setShowTeamSelectionModal(true)}>
          Teams
        </Button>
      </div>

      {showTeamSelectionModal ? (
        <TeamSelectionModal
          isOpen={showTeamSelectionModal}
          close={() => setShowTeamSelectionModal(false)}
        />
      ) : null}
    </div>
  );
}
