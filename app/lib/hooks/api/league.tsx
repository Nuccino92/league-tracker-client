'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import ROUTES from '@/app/lib/globals/routes';
import {
  useAuth,
  useCreateLeague as createLeagueContext,
} from '@/app/GlobalContext';
import { LeagueInformationResource } from '@/app/lib/types/Resources/CreateLeagueResource';
import { SubscriptionInformationSchema } from '@/app/lib/types/Resources/SubscriptionResource';
import {
  createLeagueRequest,
  getCreateLeagueSports,
  updateLeagueInformation,
} from '@/app/lib/requests/league';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';

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
      //TODO: direct them to the control panel
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

export function useCreateLeagueSports() {
  const { token } = useAuth();

  const { data: sports, status } = useQuery({
    queryKey: [QUERY_KEYS.CREATE_LEAGUE_SPORTS],
    queryFn: () => getCreateLeagueSports({ token }),
  });

  return { sports, status };
}
