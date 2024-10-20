'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Lottie from 'react-lottie';

import animationData from '@/app/assets/animations/horizontal-moving-circles.json';
import { ControlPanelInformation } from '@/app/lib/types/Responses/control-panel.types';
import { useLeague } from '@/app/lib/hooks/api/control-panel/index';
import { ControlPanelLeaguePages } from '@/app/lib/enums';

export default function LeagueControlPanelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params: any = useParams();

  //TODO: handle if error redirect off page/show 404

  const { data: leagueData, status, error } = useLeague(params['slug']);

  if (status === 'loading')
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        {/* TODO: fix warning
        react-dom.development.js:94 Warning: componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
        */}
        <Lottie
          height={250}
          width={250}
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
          }}
        />
      </div>
    );

  return (
    <LeagueControlPanelContext.Provider
      value={{ leagueData: leagueData as ControlPanelInformation }}
    >
      {status === 'success' ? <>{children}</> : null}
    </LeagueControlPanelContext.Provider>
  );
}

export const LeagueControlPanelContext = createContext({
  leagueData: {} as ControlPanelInformation,
});

export function useLeagueControlPanel() {
  const { leagueData } = useContext(LeagueControlPanelContext);

  const slug = leagueData.league_info.slug;

  const hasSeasons =
    leagueData.seasons.all_seasons && leagueData.seasons.all_seasons.length > 0
      ? true
      : false;

  const activeSeason = leagueData.seasons.active_season_id
    ? leagueData.seasons.all_seasons.find(
        (season) => season.id === leagueData.seasons.active_season_id
      ) || null
    : null;

  // ensure active season is at top of list
  const sortedSeasons = leagueData.seasons.all_seasons.slice().sort((a, b) => {
    if (a.id === leagueData.seasons.active_season_id) return -1;
    if (b.id === leagueData.seasons.active_season_id) return 1;
    return 0;
  });

  const league_data = {
    ...leagueData,
    seasons: { ...leagueData.seasons, all_seasons: sortedSeasons },
  };

  // Checks if user is admin or above
  function isAdministrator(): boolean {
    const {
      role: { role_name },
    } = leagueData;

    if (
      role_name === 'owner' ||
      role_name === 'super-admin' ||
      role_name === 'admin'
    )
      return true;

    return false;
  }

  // TODO: possibly add a new page for league information, have an about page for league so any member can access it's control panel (possily remove access from player role and have them edit their information another way)

  // so... default to /control-panel/slug which shows the about or w/e
  // then... on the sidebar wheh click home, go to /control-panel/slug/home, which shows the league information which is role blocked

  function hasPageAccess(page: ControlPanelLeaguePages): boolean {
    const {
      role: { role_name, permissions },
    } = leagueData;

    let accessGranted = false;

    if (Object.keys(permissions).length < 1) return (accessGranted = false);

    if (page === 'index') return (accessGranted = true);

    if (role_name === 'owner' || role_name === 'super-admin') {
      return (accessGranted = true);
    }

    if (page === 'home' || page === 'members') return (accessGranted = false);

    if (role_name === 'admin') {
      return (accessGranted = true);
    }

    if (page === 'registrations') return (accessGranted = false);

    switch (page) {
      case 'seasons':
        if (permissions['manage_seasons'] || permissions['manage_roster'])
          return (accessGranted = true);
        break;
      case 'teams':
        if (permissions['manage_teams']) return (accessGranted = true);
        break;
      case 'players':
        if (permissions['manage_players']) return (accessGranted = true);
        break;
      case 'schedule':
        if (permissions['manage_schedule']) return (accessGranted = true);
        break;
      case 'news':
        if (permissions['manage_news']) return (accessGranted = true);
        break;
      default:
        return (accessGranted = false);
    }

    return accessGranted;
  }

  return {
    leagueData: league_data,
    activeSeason,
    hasSeasons,
    slug,
    hasPageAccess,
    isAdministrator,
  };
}
