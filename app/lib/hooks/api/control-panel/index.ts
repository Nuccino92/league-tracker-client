import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  fetchControlPanelArchivedSeasons,
  fetchDetailedSeasonTeams,
  fetchDetailsSeasons,
  generateGameSchedule,
  getSeasonSettings,
  leagueControlPanelInformationRequest,
  updateSeasonSettingsRequest,
} from '@/app/lib/requests/control-panel';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { SeasonSettings } from '@/app/lib/types/Responses/control-panel.types';

export function useLeague(slug: string) {
  const { token } = useAuth();

  const { data, status, error } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.LEAGUE, slug],
    queryFn: () => leagueControlPanelInformationRequest({ token, slug }),
    retry: false,
    staleTime: 30000,
  });

  if (error) {
    throw error;
  }

  return { data, status, error: error as NotOk };
}

export function useArchivedSeasons(slug: string) {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.ARCHIVED_SEASONS, slug],
    queryFn: () => fetchControlPanelArchivedSeasons({ token, slug }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
}

export function useGenerateGameSchedule(slug: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateGameSchedule({ token, slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS],
      });
    },
  });
}

export function useDetailedSeasons() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { data: seasons, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.DETAILED_SEASONS, slug],
    queryFn: () => fetchDetailsSeasons({ token, slug }),
    retry: false,
    staleTime: 30000,
  });

  return { seasons, status };
}

export function useSeasonSettings(seasonId: number) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { data: settings, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.SEASON_SETTINGS, slug, seasonId],
    queryFn: () => getSeasonSettings({ token, slug, seasonId }),
    retry: false,
    staleTime: 30000,
  });

  return { settings, status };
}

export function useUpdateSeasonSettings() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seasonId,
      formValues,
    }: {
      seasonId: number;
      formValues: SeasonSettings;
    }) => updateSeasonSettingsRequest({ token, slug, seasonId, formValues }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.LEAGUE],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.SEASON_SETTINGS],
      });
    },
  });
}

export function useDetailedTeams({
  seasonId,
}: {
  seasonId: number | null | undefined;
}) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { data: teams, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.DETAILED_SEASON_TEAMS, slug, seasonId],
    queryFn: () => fetchDetailedSeasonTeams({ token, slug }),
    retry: false,
    staleTime: 30000,
    enabled: seasonId ? true : false,
  });

  return { teams, status };
}
