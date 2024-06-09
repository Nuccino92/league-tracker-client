import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { fetchControlPanelPlayers } from '@/app/lib/requests/control-panel/players';

export function usePlayers(slug: string) {
  const { token } = useAuth();
  const { getFullQueryString } = useQueryString();

  const params = getFullQueryString();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.PLAYERS, slug, params],
    queryFn: () => fetchControlPanelPlayers({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
}
