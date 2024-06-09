import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  fetchControlPanelTeams,
  fetchControlPanelTeam,
  fetchControlPanelTeamsForManagement,
  fetchControlPanelArchivedTeams,
} from '@/app/lib/requests/control-panel/teams';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { DefaultColors } from '@/app/lib/enums';
import { Team } from '@/app/lib/types/Models/Team';
import { Filter } from '@/app/lib/types/filters.types';
import { createQueryString } from '@/app/lib/utils/createQueryString';

export function useTeams(slug: string) {
  const { token } = useAuth();
  const { getFullQueryString } = useQueryString();

  const params = getFullQueryString();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params],
    queryFn: () => fetchControlPanelTeams({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
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
        return fetchControlPanelTeam({ token, slug, teamId });
      }
    },
    retry: false,
    staleTime: 30000,
  });

  return { team, status };
}

export function useTeamsForManagement({
  slug,
  page,
  query,
}: { slug: string } & Filter) {
  const { token } = useAuth();
  const { getFullQueryString } = useQueryString();

  console.log('inside hook...');

  const params = createQueryString({ page: page?.toString(), query });

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params],
    queryFn: () => fetchControlPanelTeamsForManagement({ token, slug, params }),
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

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.TEAMS, slug, params],
    queryFn: () => fetchControlPanelArchivedTeams({ token, slug, params }),
    retry: false,
    staleTime: 30000,
  });

  return { data, status };
}
