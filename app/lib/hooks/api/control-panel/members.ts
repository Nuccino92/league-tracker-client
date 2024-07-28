import { useQuery } from '@tanstack/react-query';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useAuth } from '@/app/GlobalContext';
import { fetchControlPanelMembers } from '@/app/lib/requests/control-panel/members';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import useQueryString from '../../useQueryString';

export function useMembers({
  slug,
  includeOnly = [],
  paginate = true,
}: {
  slug: string;
  paginate?: boolean;
  includeOnly?: SearchParamScope;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const params = scopeQueryParams(includeOnly);

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.MEMBERS, slug, params, paginate],
    queryFn: () => fetchControlPanelMembers({ token, slug, params, paginate }),
    staleTime: 30000,
  });

  return { data, status };
}
