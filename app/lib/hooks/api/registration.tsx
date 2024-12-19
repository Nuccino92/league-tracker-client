import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useAuth } from '@/app/GlobalContext';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { findRegistrationForm } from '@/app/lib/requests/registration';

export function useRegistrationForm({ id }: { id: number }) {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.REGISTRATION.FIND],
    queryFn: () => findRegistrationForm({ token, id }),
    retry: false,
    staleTime: 180000,
  });

  return { data, status };
}
