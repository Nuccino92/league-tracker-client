import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  createRegistrationForm,
  fetchRegistrantsList,
  fetchRegistrationForms,
  linkRegistrationToPlayer,
} from '@/app/lib/requests/control-panel/registrations';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { CreateRegistrationFormValues } from '@/app/lib/types/Responses/control-panel.types';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

export function useRegistrationForms({
  slug,
  paginate = true,
}: {
  slug: string;
  paginate?: boolean;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRATIONS, slug, paginate],
    queryFn: () => fetchRegistrationForms({ token, slug, paginate }),
    retry: false,
    staleTime: 180000,
  });

  return { response, status };
}

export function useRegistrantsList({
  paginate = true,
  enabled = true,
  includeOnly = [],
  givenParams,
}: {
  paginate?: boolean;
  enabled?: boolean;
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
    queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRANTS, slug, params, paginate],
    queryFn: () => fetchRegistrantsList({ token, slug, params, paginate }),
    enabled,
    retry: false,
    staleTime: enabled ? 180000 : 0,
    cacheTime: enabled ? 5 * 60 * 1000 : 0,
  });

  return { response, status, isInitialLoading };
}

export function useCreateRegistrationForm({ slug }: { slug: string }) {
  const { token } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formValues: CreateRegistrationFormValues) =>
      createRegistrationForm({ formValues, slug, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRANTS],
      });
    },
  });
}

export function useUpdateRegistrationForm({ slug }: { slug: string }) {
  const { token } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formValues: CreateRegistrationFormValues & { id: number }) =>
      createRegistrationForm({ formValues, slug, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRANTS],
      });
    },
  });
}

export function useLinkRegistrantToPlayer({ slug }: { slug: string }) {
  const { token } = useAuth();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number | null }) =>
      linkRegistrationToPlayer({ slug, token, id }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRANTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.PLAYERS],
      });
    },
  });
}
