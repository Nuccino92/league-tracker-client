import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { fetchTournaments } from '@/app/lib/requests/control-panel/tournaments';

export function useTournaments() {
  const { token } = useAuth();

  const { slug } = useLeagueControlPanel();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug],
    queryFn: () => fetchTournaments({ token }),
  });

  return { response, status };
}
