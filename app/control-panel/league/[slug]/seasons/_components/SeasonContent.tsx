'use client';

import { useEffect, useState } from 'react';

import TeamList from '@/app/control-panel/league/[slug]/seasons/_components/TeamList';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import FocusedTeamArea from './FocusedTeamArea';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import StyledBox from '@/app/lib/components/StyledBox';
import PersonSelecting from '@/app/assets/vectors/PersonSelecting';
import classNames from 'classnames';
import { IconAppstoreAdd, Spinner } from '@/app/lib/SVGs';
import TeamRoster from '@/app/control-panel/league/[slug]/teams/[id]/_components/TeamRoster';
import { Button } from '@/app/lib/components/Button';
import FreeAgentsModal from '@/app/control-panel/league/[slug]/players/_components/FreeAgentsModal';
import { createQueryString } from '@/app/lib/utils/createQueryString';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import AddTeamToSeasonModal from '@/app/control-panel/league/[slug]/teams/_components/AddTeamToSeasonModal';

type Props = {
  slug: string;
};

export default function SeasonContent({ slug }: Props) {
  const {
    leagueData: { seasons },
    hasSeasons,
  } = useLeagueControlPanel();

  const searchParams = useSearchParams();
  const seasonParam = searchParams.get('season');

  const shouldRenderContent = seasonParam
    ? seasons.all_seasons.find((season) => season.id === parseInt(seasonParam))
      ? true
      : false
    : false;

  //TODO: test w/ empty string or letters

  return (
    <>
      {shouldRenderContent ? (
        <Content slug={slug} />
      ) : (
        <StyledBox classes='flex items-center justify-center flex-col py-10'>
          <div className='text-xl font-medium'>
            {hasSeasons
              ? 'Select a season from the dropdown to start managing'
              : 'Create a new season to begin managing'}
          </div>
          <div className='-mb-6'>
            <PersonSelecting height={220} width={220} fill='secondary' />
          </div>
        </StyledBox>
      )}
    </>
  );
}

function Content({ slug }: Props) {
  const searchParams = useSearchParams();

  const {
    leagueData: { seasons },
  } = useLeagueControlPanel();

  const seasonParam = searchParams.get('season') as string;
  const focusedTeamParam = searchParams.get('team');
  const hasSeasonParam = seasonParam ? true : false;
  // fetch both teams for season & roster for selected team & free agents

  // use state or params for the selected team!

  const { data: teams, status: teamStatus } = useTeams({
    slug,
    paginate: false,
    enabled: hasSeasonParam,
    includeOnly: ['season'],
  });

  const focusedSeason = seasons.all_seasons.find(
    (season) => season.id === parseInt(seasonParam)
  );

  const focusedTeamId = focusedTeamParam ? parseInt(focusedTeamParam) : null;
  const focusedTeam =
    teams && focusedTeamId
      ? teams.find((team) => team.id === focusedTeamId) || null
      : null;

  const [selectedSection, setSelectedSection] = useState<'teams' | 'roster'>(
    'teams'
  );

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );

  const [showFreeAgentsModal, setShowFreeAgentsModal] = useState(false);
  const [showAddToSeasonModal, setShowAddToSeasonModal] = useState(false);

  const debouncedSearch = useDebounce(searchInputValue, 750);

  // useEffect(() => {
  //   router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  // }, [debouncedSearch, pathname, router]);

  //TODO: need to handle when the user puts in a random false season param value and it doesnt return anything
  return (
    <main className=''>
      <h4 className='mb-6 text-xl font-bold text-zinc-900'>
        {focusedSeason?.name}
      </h4>

      <div className='flex space-x-4 '>
        <button
          className={classNames(
            selectedSection === 'teams'
              ? 'bg-white'
              : 'bg-primary/50 text-white',
            'w-max rounded-t-lg  px-6 py-2 font-medium'
          )}
          onClick={() => setSelectedSection('teams')}
        >
          Teams
        </button>

        {focusedTeam && (
          <button
            disabled={!focusedTeam}
            className={classNames(
              selectedSection === 'roster'
                ? 'bg-white'
                : 'bg-primary/50 text-white',
              'w-max rounded-t-lg px-6 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
            )}
            onClick={() => {
              if (!focusedTeam) return;

              setSelectedSection('roster');
            }}
          >
            {focusedTeam.name}
          </button>
        )}
      </div>

      <div className='bg-white text-sm'>
        <div className='flex items-center justify-between space-x-6 border-b p-8 text-xl font-bold'>
          <div className='flex items-center gap-6'>
            <div className='text-xl font-bold'>
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

        {teams && teamStatus === 'success' && (
          <>
            {selectedSection === 'teams' && (
              //TODO: need to change styling, match team roster
              <TeamList teams={teams} focusedTeamId={focusedTeamId} />
            )}
            {selectedSection === 'roster' && focusedTeam && <TeamRoster />}
          </>
        )}

        {teamStatus === 'loading' && (
          <div className='flex items-center justify-center p-8 py-14'>
            <Spinner height={30} width={30} />
          </div>
        )}
      </div>

      {/* TODO: possibly fetch the roster/free agents in here and wait for the response before rendering  */}

      {showFreeAgentsModal && selectedSeason && focusedTeam && (
        <FreeAgentsModal
          isOpen={showFreeAgentsModal}
          close={() => setShowFreeAgentsModal(false)}
          slug={slug}
          seasonId={selectedSeason.toString()}
          teamId={focusedTeam.id.toString()}
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
