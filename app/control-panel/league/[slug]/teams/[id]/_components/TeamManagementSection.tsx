'use client';

import { useState } from 'react';
import {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
} from 'next/navigation';
import classNames from 'classnames';

import { useFreeAgents } from '@/app/lib/hooks/api/control-panel/players';
import TeamRoster from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamRoster';
import TeamSchedule from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamSchedule';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import ListBox from '@/app/lib/components/Listbox';
import useQueryString from '@/app/lib/hooks/useQueryString';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import { useCheckIfTeamIsInSeason } from '@/app/lib/hooks/api/control-panel/teams';
import { Spinner } from '@/app/lib/SVGs';

export default function TeamManagementSection({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();

  const { leagueData, activeSeason } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const { createQueryString } = useQueryString();

  const [selectedSection, setSelectedSection] = useState<'roster' | 'schedule'>(
    'roster'
  );

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  const { data, status } = useCheckIfTeamIsInSeason({
    teamID: params.id as string,
    seasonID: selectedSeason ? selectedSeason.toString() : null,
    slug: params.slug as string,
  });

  return (
    <div className='text-sm'>
      <div className='flex space-x-4 '>
        <button
          className={classNames(
            selectedSection === 'roster'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg  px-6 py-2 font-medium'
          )}
          onClick={() => setSelectedSection('roster')}
        >
          Roster
        </button>
        <button
          disabled={!activeSeason}
          className={classNames(
            selectedSection === 'schedule'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg px-6 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onClick={() => {
            if (!activeSeason) return;

            setSelectedSection('schedule');
          }}
        >
          Schedule
        </button>
      </div>
      <div className='bg-white'>
        <div className='flex items-center justify-between space-x-6 border-b p-8 text-xl font-bold'>
          <div className='text-xl font-bold'>
            {selectedSection === 'roster' ? 'Team Roster' : null}
            {selectedSection === 'schedule' ? 'Team Schedule' : null}
          </div>

          <div className='flex items-center space-x-2 text-sm'>
            <span>Season:</span>
            <ListBox
              rootClasses='w-max !text-xs'
              value={selectedSeason ? selectedSeason.toString() : null}
              onChange={(value) =>
                router.push(
                  pathname +
                    '?' +
                    createQueryString('season', value?.toString())
                )
              }
              buttonText={
                seasons.all_seasons.find(
                  (season) => season.id === selectedSeason
                )?.name ?? 'Select a Season'
              }
              options={[
                ...transformIntoOptions(seasons.all_seasons, {
                  labelKey: 'name',
                  valueKey: 'id',
                }),
              ]}
            />
          </div>
        </div>

        {status === 'success' && data ? (
          <>
            {data?.is_team_involved_in_season ? (
              <>
                {selectedSection === 'roster' ? <TeamRoster /> : null}
                {selectedSection === 'schedule' ? (
                  <TeamSchedule slug={slug} />
                ) : null}
              </>
            ) : (
              <div className='flex items-center justify-center p-7 py-10 text-lg font-medium'>
                This team is not part of the selected season
              </div>
            )}
          </>
        ) : null}

        {status === 'loading' ? (
          <div className='flex items-center justify-center p-8 py-14'>
            <Spinner height={30} width={30} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
