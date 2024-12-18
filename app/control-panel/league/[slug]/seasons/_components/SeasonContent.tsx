'use client';

import { useEffect, useState } from 'react';

import TeamList from '@/app/control-panel/league/[slug]/seasons/_components/TeamList';
import { useSearchParams } from 'next/navigation';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import classNames from 'classnames';
import { IconAppstoreAdd } from '@/app/lib/SVGs';
import TeamRoster from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamRoster';
import { Button } from '@/app/lib/components/Button';
import FreeAgentsModal from '@/app/control-panel/league/[slug]/players/_components/FreeAgentsModal';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import AddTeamToSeasonModal from '@/app/control-panel/league/[slug]/teams/_components/AddTeamToSeasonModal';
import SeasonsList from '@/app/control-panel/league/[slug]/seasons/_components/SeasonsList';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';

type Props = {
  slug: string;
};

export default function SeasonContent({ slug }: Props) {
  return <Content slug={slug} />;
}

function Content({ slug }: Props) {
  const searchParams = useSearchParams();

  const {
    leagueData: { seasons },
  } = useLeagueControlPanel();

  const seasonParam = searchParams.get('season') as string;
  const focusedTeamParam = searchParams.get('team');

  const focusedSeason = seasons.all_seasons.find(
    (season) => season.id === parseInt(seasonParam)
  );

  const [selectedSection, setSelectedSection] = useState<
    'seasons' | 'teams' | 'roster'
  >('seasons');

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const { data: teams, status: teamStatus } = useTeams({
    slug,
    paginate: false,
    enabled: selectedSeason ? true : false,
    includeOnly: ['season'],
  });

  const focusedTeam =
    teams && teams.find((team) => team.id.toString() === focusedTeamParam);

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );

  const [showFreeAgentsModal, setShowFreeAgentsModal] = useState(false);
  const [showAddToSeasonModal, setShowAddToSeasonModal] = useState(false);

  const debouncedSearch = useDebounce(searchInputValue, 750);

  // useEffect(() => {
  //   router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  // }, [debouncedSearch, pathname, router]);

  useEffect(() => {
    if (focusedTeamParam) {
      setSelectedSection('roster');
    } else if (seasonParam) {
      setSelectedSection('teams');
    } else {
      setSelectedSection('seasons');
    }
  }, [focusedTeamParam, searchParams, seasonParam]);

  return (
    <main className='pb-10'>
      <div className='mb-4 flex h-10 items-center gap-2'>
        {focusedSeason && (
          <div className='flex h-8 items-center justify-center rounded-xl border bg-white px-4 text-sm font-medium text-secondary'>
            {focusedSeason.name}
          </div>
        )}{' '}
        {focusedTeam && (
          <div className='flex h-8 items-center justify-center rounded-full border bg-white px-4 text-sm font-medium text-secondary'>
            {focusedTeam.name}
          </div>
        )}
      </div>

      <div className='flex space-x-4 '>
        <button
          className={classNames(
            selectedSection === 'seasons'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg  px-6 py-2 font-medium'
          )}
          onClick={() => setSelectedSection('seasons')}
        >
          Seasons
        </button>

        <button
          disabled={!selectedSeason}
          className={classNames(
            selectedSection === 'teams'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg px-6 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onClick={() => setSelectedSection('teams')}
        >
          Teams
        </button>

        <button
          disabled={!focusedTeamParam}
          className={classNames(
            selectedSection === 'roster'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg px-6 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
          )}
          onClick={() => {
            if (!focusedTeamParam) return;

            setSelectedSection('roster');
          }}
        >
          Roster
        </button>
      </div>

      <div className='bg-white text-sm'>
        <div className='flex h-[90px] items-center justify-between space-x-6 border-b p-8 text-xl font-bold'>
          <div className='flex items-center gap-6'>
            <div className=' text-xl font-bold'>
              {selectedSection === 'seasons' ? 'Seasons' : null}
              {selectedSection === 'teams' ? 'Teams' : null}
              {selectedSection === 'roster' ? 'Roster' : null}
            </div>

            {selectedSection === 'roster' && (
              <SearchBar
                inputValue={searchInputValue}
                setInputValue={setSearchInputValue}
                placeholder='Search for players...'
                containerClasses='font-normal !bg-slate-100'
              />
            )}
          </div>

          {seasons.all_seasons.length > 0 && (
            <div className='flex items-center space-x-4'>
              {selectedSection === 'teams' && (
                <Button
                  onClick={() => setShowAddToSeasonModal(true)}
                  className='space-x-2'
                >
                  <IconAppstoreAdd height={20} width={20} />
                  <span>Manage Teams</span>
                </Button>
              )}
              {selectedSection === 'roster' && (
                <Button onClick={() => setShowFreeAgentsModal(true)}>
                  Free Agents
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Lists */}
        {selectedSection === 'seasons' && (
          <SeasonsList onLinkClick={() => setSelectedSection('teams')} />
        )}
        {selectedSection === 'teams' && (
          <TeamList
            slug={slug}
            teams={teams}
            status={teamStatus}
            onLinkClick={() => setSelectedSection('roster')}
          />
        )}
        {selectedSection === 'roster' && focusedTeamParam && <TeamRoster />}
      </div>

      {showFreeAgentsModal && selectedSeason && focusedTeamParam && (
        <FreeAgentsModal
          isOpen={showFreeAgentsModal}
          close={() => setShowFreeAgentsModal(false)}
          slug={slug}
          seasonId={selectedSeason.toString()}
          teamId={focusedTeamParam}
        />
      )}

      {showAddToSeasonModal ? (
        <AddTeamToSeasonModal
          isOpen={showAddToSeasonModal}
          close={() => {
            //TODO: invalidate the teams-control-panel params
            setShowAddToSeasonModal(false);
          }}
        />
      ) : null}
    </main>
  );
}
