import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  createRegistrationForm,
  fetchRegistrantsList,
  fetchRegistrationForms,
} from '@/app/lib/requests/control-panel/registrations';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { CreateRegistrationFormValues } from '@/app/lib/types/Responses/control-panel.types';

export function useRegistrationForms({
  slug,
  paginate = true,
  includeOnly = [],
}: {
  slug: string;
  paginate?: boolean;
  includeOnly?: SearchParamScope;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const params = scopeQueryParams(includeOnly);

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRATIONS, slug, params, paginate],
    queryFn: () => fetchRegistrationForms({ token, slug, params, paginate }),
    retry: false,
    staleTime: 180000,
  });

  return { data, status };
}

export function useRegistrationForm() {}

export function useRegistrantsList({
  slug,
  paginate = true,
  includeOnly = [],
}: {
  slug: string;
  paginate?: boolean;
  includeOnly?: SearchParamScope;
}) {
  const { token } = useAuth();
  const { scopeQueryParams } = useQueryString();

  const params = scopeQueryParams(includeOnly);

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.REGISTRANTS, slug, params, paginate],
    queryFn: () => fetchRegistrantsList({ token, slug, params, paginate }),
    retry: false,
    staleTime: 180000,
  });

  return { data, status };
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
