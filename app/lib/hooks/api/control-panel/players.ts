import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  fetchControlPanelArchivedPlayers,
  fetchControlPanelPlayer,
  fetchControlPanelPlayers,
  fetchFreeAgents,
} from '@/app/lib/requests/control-panel/players';
import { Filter, SearchParamScope } from '@/app/lib/types/filters.types';
import { createQueryString } from '@/app/lib/utils/createQueryString';
import { Player } from '@/app/lib/types/Models/Player';

// TODO: ascertain how to know when to use pagination vs. getting complete list
export function usePlayers({
  slug,
  paginate = true,
  enabled = true,
  includeOnly = [],
}: {
  slug: string;
  paginate?: boolean;
  enabled?: boolean;
  includeOnly?: SearchParamScope;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const params = scopeQueryParams(includeOnly);

  const { data, status, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.PLAYERS, slug, params, paginate],
    queryFn: () => fetchControlPanelPlayers({ token, slug, params, paginate }),
    retry: 1,
    staleTime: 30000,
    enabled,
    cacheTime: enabled ? 5 * 60 * 1000 : 0,
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
          // number: null,
          // age: null,
          email: null,
          phoneNumber: null,
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

export function useFreeAgents({
  slug,
  paginate = true,
}: {
  slug: string;
  paginate?: boolean;
}) {
  const { token } = useAuth();

  const { data, status, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.FREE_AGENTS, slug],
    queryFn: () => fetchFreeAgents({ token, slug, paginate }),
    retry: 1,
    staleTime: 30000,
  });

  return { data, status, isLoading };
}
