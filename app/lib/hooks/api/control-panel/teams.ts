import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  controlPanelTeamsRequest,
  controlPanelTeamRequest,
  controlPanelTeamsForManagementRequest,
  controlPanelArchivedTeamsRequest,
  controlPanelTeamsForDropdownRequest,
  checkIfTeamIsInSeasonRequest,
} from '@/app/lib/requests/control-panel/teams';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { DefaultColors } from '@/app/lib/enums';
import { Team } from '@/app/lib/types/Models/Team';
import { Filter, SearchParamScope } from '@/app/lib/types/filters.types';
import { createQueryString } from '@/app/lib/utils/createQueryString';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

/**
 * @description returns a list of teams with ability to filter using url params.
 * Use pagination default unless you need full list of teams.
 * Add onlyUseSeasonParam if you want to bypass all url params except for season
 *
 * @returns
 * with params BaseTeam[].
 * without params redirects back via router.back()
 */
export function useTeams({
  paginate = true,
  enabled = true,
  includeOnly = [],
  givenParams,
}: {
  paginate?: boolean;
  enabled?: boolean;
  includeOnly?: SearchParamScope;
  givenParams?: string;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const { slug } = useLeagueControlPanel();

  const params = givenParams ? givenParams : scopeQueryParams(includeOnly);

  const {
    data: response,
    status,
    isInitialLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params, paginate],
    queryFn: () => controlPanelTeamsRequest({ token, slug, params, paginate }),
    enabled,
    retry: false,
    staleTime: enabled ? 180000 : 0,
    cacheTime: enabled ? 5 * 60 * 1000 : 0,
  });

  return { response, status, isInitialLoading };
}

export function useTeam({ slug, teamId }: { slug: string; teamId?: number }) {
  const { token } = useAuth();

  const { data: team, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAM, slug, teamId],
    queryFn: () => {
      if (!teamId) {
        return {
          name: '',
          logo: null,
          description: '',
          primary_color: DefaultColors.Primary,
          secondary_color: DefaultColors.Secondary,
        } as Team;
      } else {
        return controlPanelTeamRequest({ token, slug, teamId });
      }
    },
    retry: false,
    staleTime: 30000,
  });

  return { team, status };
}

export function useAddTeam() {
  /**
   * Invalidate
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params]
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS_FOR_DROPDOWN, slug]
   */
  // return useMutation()
}

export function useUpdateTeam() {
  /**
   * Invalidate
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params]
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS_FOR_DROPDOWN, slug]
   */
  // return useMutation()
}

export function useTeamsForManagement({
  slug,
  page,
  query,
}: { slug: string } & Filter) {
  const { token } = useAuth();
  const { getFullQueryString } = useQueryString();

  const params = createQueryString({ page: page?.toString(), query });

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params],
    queryFn: () =>
      controlPanelTeamsForManagementRequest({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
}

export function useArchivedTeams({
  slug,
  page,
  query,
}: { slug: string } & Filter) {
  const { token } = useAuth();

  const params = createQueryString({ page: page?.toString(), query });

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.ARCHIVED_TEAMS, slug, params],
    queryFn: () => controlPanelArchivedTeamsRequest({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { response, status };
}

export function useRestoreArchivedTeam() {
  /**
   * Invalidate
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params]
   * [QUERY_KEYS.CONTROL_PANEL.TEAMS_FOR_DROPDOWN, slug]
   */
  // return useMutation()
}

// TODO: needs to be invalidated when creating/updating/deleting a team
export function useControlPanelTeamsForDropdown({ slug }: { slug: string }) {
  const { token } = useAuth();

  const { data: teamsDropdownList, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS_FOR_DROPDOWN, slug],
    queryFn: () => controlPanelTeamsForDropdownRequest({ token, slug }),
    retry: 2,
    staleTime: Infinity,
  });

  return { teamsDropdownList, status };
}

export function useCheckIfTeamIsInSeason({
  teamID,
  seasonID,
  slug,
}: {
  teamID: string;
  seasonID: string | null;
  slug: string;
}) {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: [
      QUERY_KEYS.CONTROL_PANEL.TEAM_IS_IN_ACTIVE_SEASON,
      teamID,
      seasonID,
    ],
    queryFn: () => {
      if (!seasonID) return { is_team_involved_in_season: false };

      return checkIfTeamIsInSeasonRequest({ token, teamID, seasonID, slug });
    },
    retry: 1,
    staleTime: Infinity,
  });

  return { data, status };
}
