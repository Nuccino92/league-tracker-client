'use client';

import { useState } from 'react';

import TeamList from '@/app/control-panel/league/[slug]/seasons/_components/TeamList';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import { useSearchParams } from 'next/navigation';
import FocusedTeamArea from './FocusedTeamArea';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import StyledBox from '@/app/lib/components/StyledBox';
import PersonSelecting from '@/app/assets/vectors/PersonSelecting';

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

  const shouldRenderTeamsList = teams && teamStatus === 'success';

  //TODO: need to handle when the user puts in a random false season param value and it doesnt return anything
  return (
    <main className='space-y-6'>
      <h4 className='-mb-2 text-xl font-bold text-zinc-900'>
        {focusedSeason?.name}
      </h4>

      {shouldRenderTeamsList ? (
        <TeamList teams={teams} focusedTeamId={focusedTeamId} />
      ) : null}

      {/* TODO: possibly fetch the roster/free agents in here and wait for the response before rendering  */}

      {focusedTeam ? (
        <FocusedTeamArea slug={slug} focusedTeam={focusedTeam} />
      ) : null}
    </main>
  );
}
