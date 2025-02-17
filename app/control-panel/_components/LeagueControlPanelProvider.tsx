'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'next/navigation';
import Lottie from 'react-lottie';

import animationData from '@/app/assets/animations/horizontal-moving-circles.json';
import { ControlPanelInformation } from '@/app/lib/types/Responses/control-panel.types';
import { useLeague } from '@/app/lib/hooks/api/control-panel/index';
import { ControlPanelLeaguePages } from '@/app/lib/enums';
import { IS_CONTROL_PANEL_SIDEBAR_OPEN } from '@/app/lib/globals/localStorage';
import { MemberRole } from '@/app/lib/types/Models/Member';

export default function LeagueControlPanelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params: any = useParams();

  //TODO: handle if error redirect off page/show 404

  const { data: leagueData, status, error } = useLeague(params['slug']);

  const { isOpen, toggleSidebar } = useControlPanelSidebar();

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
      value={{
        leagueData: leagueData as ControlPanelInformation,
        isOpen,
        toggleSidebar,
      }}
    >
      {status === 'success' ? <>{children}</> : null}
    </LeagueControlPanelContext.Provider>
  );
}

interface LeagueControlPanelContextType {
  leagueData: ControlPanelInformation;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const LeagueControlPanelContext =
  createContext<LeagueControlPanelContextType | null>(null);

export type FeatureAccess = {
  dashboard: boolean;
  members: boolean;
  seasons: boolean;
  teams: boolean;
  players: boolean;
  schedule: boolean;
  registrations: boolean;
  notices: boolean;
  settings: boolean;
  submitScore: boolean;
};

type RolePermissions = {
  [K in MemberRole]: FeatureAccess;
};

export function useLeagueControlPanel() {
  const context = useContext(LeagueControlPanelContext);
  if (!context) {
    throw new Error(
      'useLeagueControlPanel must be used within a LeagueControlPanelProvider'
    );
  }

  const { leagueData, isOpen: isSidebarExpanded, toggleSidebar } = context;

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

  const rolePermissions: RolePermissions = {
    owner: {
      dashboard: true,
      members: true,
      seasons: true,
      teams: true,
      players: true,
      schedule: true,
      registrations: true,
      notices: true,
      settings: true,
      submitScore: true,
    },
    'super-admin': {
      dashboard: true,
      members: true,
      seasons: true,
      teams: true,
      players: true,
      schedule: true,
      registrations: true,
      notices: true,
      settings: true,
      submitScore: true,
    },
    admin: {
      dashboard: true,
      members: false,
      seasons: true,
      teams: true,
      players: true,
      schedule: true,
      registrations: false,
      notices: true,
      settings: false,
      submitScore: true,
    },
    'team-manager': {
      dashboard: true,
      members: false,
      seasons: false,
      teams: true,
      players: true,
      schedule: true,
      registrations: false,
      notices: false,
      settings: false,
      submitScore: true,
    },
    scorekeeper: {
      dashboard: false,
      members: false,
      seasons: false,
      teams: false,
      players: false,
      schedule: false,
      registrations: false,
      notices: false,
      settings: false,
      submitScore: true,
    },
  };

  function hasPageAccess(page: ControlPanelLeaguePages): boolean {
    const {
      role: { role_name },
    } = leagueData;

    if (page === 'index') return true;

    const currentRolePermissions =
      rolePermissions[role_name as keyof typeof rolePermissions];

    return (
      currentRolePermissions[page as keyof typeof currentRolePermissions] ??
      false
    );
  }

  return {
    leagueData: league_data,
    activeSeason,
    hasSeasons,
    slug,
    hasPageAccess,
    isAdministrator,
    rolePermissions,
    sidebar: { isSidebarExpanded, toggleSidebar },
  };
}

const getInitialState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(IS_CONTROL_PANEL_SIDEBAR_OPEN);
    return stored ? JSON.parse(stored) : true; // Default to true if no value exists
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return false;
  }
};

export const useControlPanelSidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Set up client-side state
  useEffect(() => {
    setIsClient(true);
    const initialState = getInitialState();
    setIsOpen(initialState);
  }, []);

  // Sync with localStorage when state changes
  useEffect(() => {
    if (!isClient) return;

    try {
      window.localStorage.setItem(
        IS_CONTROL_PANEL_SIDEBAR_OPEN,
        JSON.stringify(isOpen)
      );
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [isOpen, isClient]);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return {
    isOpen,
    toggleSidebar,
  } as const;
};
