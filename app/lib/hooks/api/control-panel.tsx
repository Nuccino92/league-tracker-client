import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import { leagueControlPanelInformationRequest } from '@/app/lib/requests/control-panel';

//region - league
export function useLeague(slug: string) {
  const { token } = useAuth();

  const { data, status, error } = useQuery({
    queryKey: ['league-control-panel', slug],
    queryFn: () => leagueControlPanelInformationRequest({ token, slug }),
    retry: false,
    staleTime: 30000,
  });

  if (error) {
    throw error;
  }

  return { data, status, error: error as NotOk };
}

//endregion
