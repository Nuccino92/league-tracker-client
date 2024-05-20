'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import ROUTES from '@/app/lib/routesConfig';
import {
  useAuth,
  useCreateLeague as createLeagueContext,
} from '@/app/GlobalContext';
import { LeagueInformationResource } from '@/app/lib/types/Resources/CreateLeagueResource';
import { SubscriptionInformationSchema } from '@/app/lib/types/Resources/SubscriptionResource';
import {
  createLeagueRequest,
  findLeagueRequest,
  updateLeagueInformation,
} from '@/app/lib/requests/league';

export function useFindLeague(slug: string) {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: ['league', slug],
    queryFn: () => findLeagueRequest({ token, slug }),
  });

  return { data, status };
}

export function useCreateLeague() {
  const { token } = useAuth();

  const { setShowCreateLeagueModal } = createLeagueContext();

  return useMutation({
    mutationFn: ({
      formData,
      subscription,
    }: {
      formData: LeagueInformationResource;
      subscription?: SubscriptionInformationSchema;
    }) => createLeagueRequest({ token, formData, subscription }),
    onSuccess: (data) => {
      setShowCreateLeagueModal(false);
      window.location.href =
        ROUTES.CONTROL_PANEL + ROUTES.LEAGUE + '/' + data.slug;
    },
  });
}

export function useUpdateLeague() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      formData,
    }: {
      slug: string;
      formData: LeagueInformationResource;
    }) => {
      return updateLeagueInformation({ token, slug, leagueData: formData });
    },
    onSuccess: (data, variables) => {
      if (variables.slug !== data.slug) {
        window.location.href =
          ROUTES.CONTROL_PANEL + ROUTES.LEAGUE + '/' + data.slug;
      }
    },
    onError: () => {},
  });
}
