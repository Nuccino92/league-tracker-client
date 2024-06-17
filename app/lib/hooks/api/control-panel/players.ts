import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  fetchControlPanelArchivedPlayers,
  fetchControlPanelPlayer,
  fetchControlPanelPlayers,
} from '@/app/lib/requests/control-panel/players';
import { Player } from '@/app/lib/types/Models/Player';
import { Filter } from '@/app/lib/types/filters.types';
import { createQueryString } from '@/app/lib/utils/createQueryString';

export function usePlayers(slug: string) {
  const { token } = useAuth();
  const { getFullQueryString } = useQueryString();

  const params = getFullQueryString();

  const { data, status, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.PLAYERS, slug, params],
    queryFn: () => fetchControlPanelPlayers({ token, slug, params }),
    retry: 1,
    staleTime: 30000,
  });

  return { data, status, isLoading };
}

export function usePlayer({
  slug,
  playerId,
}: {
  slug: string;
  playerId?: number;
}) {
  const { token } = useAuth();

  const { data: player, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAM, slug, playerId],
    queryFn: () => {
      if (!playerId) {
        return {
          id: null,
          name: '',
          avatar: null,
          number: null,
          age: null,
        } as Player;
      } else {
        return fetchControlPanelPlayer({ token, slug, playerId });
      }
    },
    retry: false,
    staleTime: 30000,
  });

  return { player, status };
}

export function useArchivedPlayers({
  slug,
  page,
  query,
}: { slug: string } & Filter) {
  const { token } = useAuth();

  const params = createQueryString({ page: page?.toString(), query });

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.ARCHIVED_PLAYERS, slug, params],
    queryFn: () => fetchControlPanelArchivedPlayers({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
}
