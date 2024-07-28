import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  fetchControlPanelArchivedSeasons,
  leagueControlPanelInformationRequest,
} from '@/app/lib/requests/control-panel';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';

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
