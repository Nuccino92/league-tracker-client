import { useMutation, useQuery } from '@tanstack/react-query';

import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useAuth } from '@/app/GlobalContext';
import {
  addMemberRequest,
  fetchControlPanelMember,
  fetchControlPanelMembers,
  modifyMemberRequest,
  removeMemberRequest,
  validateEmailForMembersRequest,
} from '@/app/lib/requests/control-panel/members';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { ControlPanelMemberForEdit } from '@/app/lib/types/Responses/control-panel.types';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import {
  AddMemberSaveValues,
  ModifyMemberSaveValues,
} from '@/app/lib/types/Resources/CreateMemberResource';

export function useMembers({
  enabled = true,
  includeOnly = [],
  paginate = true,
  givenParams,
}: {
  enabled?: boolean;
  paginate?: boolean;
  includeOnly?: SearchParamScope;
  givenParams?: string;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const { slug } = useLeagueControlPanel();

  const params = givenParams ? givenParams : scopeQueryParams(includeOnly);

  const {
    data: response,
    status,
    isInitialLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.MEMBERS, slug, params, paginate],
    queryFn: () => fetchControlPanelMembers({ token, slug, params, paginate }),
    staleTime: enabled ? 180000 : 0,
    cacheTime: enabled ? 5 * 60 * 1000 : 0,
  });

  return { response, status, isInitialLoading };
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
          name: 'Jerry Smith',
          email: '',
          role: 'admin',
          status: 'pending',
        } as ControlPanelMemberForEdit;
      } else {
        return fetchControlPanelMember({ token, slug, memberId });
      }
    },
    staleTime: 30000,
  });

  return { member, status };
}

export function useValidateUserEmailForMembers() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (email: string) =>
      validateEmailForMembersRequest({ email, token }),
    onSuccess: (data) => {},
  });
}

export function useAddTeamMember() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (values: AddMemberSaveValues) =>
      addMemberRequest({ token, values }),
    onSuccess: (data) => {},
  });
}

export function useModifyTeamMember() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (values: ModifyMemberSaveValues) =>
      modifyMemberRequest({ token, values }),
    onSuccess: (data) => {},
  });
}

export function useRemoveMember() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (id: number) => removeMemberRequest({ token, id }),
    onSuccess: (data) => {},
  });
}
