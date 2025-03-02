import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { fetchTournaments } from '@/app/lib/requests/control-panel/tournaments';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import useQueryString from '@/app/lib/hooks/useQueryString';

export function useTournaments({
  enabled = true,
  includeOnly = [],
  givenParams,
}: {
  enabled?: boolean;
  includeOnly?: SearchParamScope;
  givenParams?: string;
}) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { scopeQueryParams } = useQueryString();
  const params = givenParams ? givenParams : scopeQueryParams(includeOnly);

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params],
    queryFn: () => fetchTournaments({ token, slug, params }),
  });

  return { response, status };
}
