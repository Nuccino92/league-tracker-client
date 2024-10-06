'use client';

import { useSearchParams } from 'next/navigation';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { IconTeamLine } from '@/app/lib/SVGs';

export default function TeamRoster() {
  const searchParams = useSearchParams();

  const { leagueData, activeSeason, hasSeasons } = useLeagueControlPanel();

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  /**
   * If the team is involved in the season, display the roster. Only allow editing if they are in the active season
   *
   * if no season is selected then display message to select season if the league actually has seasons. if they are not involved in a selected season then display message saying that this team isnt involved in the selected season
   */

  return (
    <div>
      {hasSeasons ? (
        <div className='p-8'>rostar</div>
      ) : (
        <div className='flex flex-col items-center space-y-2 border border-transparent py-[132px] text-center text-lg font-medium'>
          <IconTeamLine height={44} width={44} />

          <div>
            <span className='font-bold'>{leagueData.league_info.name}</span>{' '}
            does not have an active season
          </div>
        </div>
      )}
    </div>
  );
}
