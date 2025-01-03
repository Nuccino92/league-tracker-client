import { useQuery } from '@tanstack/react-query';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useAuth } from '@/app/GlobalContext';
import {
  fetchControlPanelMember,
  fetchControlPanelMembers,
} from '@/app/lib/requests/control-panel/members';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import useQueryString from '../../useQueryString';
import { ControlPanelMemberForEdit } from '@/app/lib/types/Responses/control-panel.types';

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

  // TODO: possibly move this outside and pass in the params to the hook
  const params = scopeQueryParams(includeOnly);

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.MEMBERS, slug, params, paginate],
    queryFn: () => fetchControlPanelMembers({ token, slug, params, paginate }),
    staleTime: 30000,
  });

  return { response, status };
}

export function useMember({
  slug,
  memberId,
}: {
  slug: string;
  memberId?: number;
}) {
  const { token } = useAuth();

  const { data: member, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.MEMBER, slug, memberId],
    queryFn: () => {
      if (!memberId) {
        return {
          id: null,
          role: 'member',
          name: 'Jerry Smith',
        } as ControlPanelMemberForEdit;
      } else {
        return fetchControlPanelMember({ token, slug, memberId });
      }
    },
    staleTime: 30000,
  });

  return { member, status };
}
