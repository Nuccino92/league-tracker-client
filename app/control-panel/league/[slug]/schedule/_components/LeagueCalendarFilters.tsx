'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import ListBox from '@/app/lib/components/Listbox';
import useQueryString from '@/app/lib/hooks/useQueryString';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import TeamSelectionModal from '@/app/lib/components/TeamSelectionModal';
import CalendarEventOptionFilter from '@/app/lib/components/_scheduler/CalendarEventOptionFilter';

//TODO: possibly make reusable for calendar page + team details page
export default function LeagueCalendarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const { createQueryString } = useQueryString();

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  const [showTeamSelectionModal, setShowTeamSelectionModal] = useState(false);

  //TODO: determine whether to show the filters inside a modal or to just display them plainly

  //Possibly add create schedule button which checks if a game is played or not. if not game has already been played allow the user to generate a schedule w/ the selected teams

  //todo: show some sort of ui for teams

  return (
    <div className='flex items-center justify-between border-b p-8'>
      <h1 className='text-xl font-bold'>Calendar</h1>

      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2 text-sm'>
          <span>Season:</span>
          <ListBox
            buttonClasses='border'
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
          <CalendarEventOptionFilter />
        </div>

        <Button type='button' onClick={() => setShowTeamSelectionModal(true)}>
          Teams
        </Button>
      </div>

      {showTeamSelectionModal ? (
        <TeamSelectionModal
          isOpen={showTeamSelectionModal}
          close={() => setShowTeamSelectionModal(false)}
          onTeamSelection={(value) => {
            router.push(pathname + '?' + createQueryString('teams', value));
          }}
        />
      ) : null}
    </div>
  );
}
