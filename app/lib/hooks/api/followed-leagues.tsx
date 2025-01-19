import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  addBookmarkedLeague,
  getFollowedLeagues,
  getLeagueBillingHistory,
  getLeaguesForBookmark,
  getLeagueSubscriptionInformation,
  removeBookmarkedLeague,
  removeJoinedLeague,
  toggleLeagueSubscriptionAutoRenewal,
} from '@/app/lib/requests/followed-leagues';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';

export function useFollowedLeagues() {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.FOLLOWED_LEAGUES],
    queryFn: () => getFollowedLeagues({ token }),
    staleTime: 60000,
  });

  return { response, status };
}

export function useRemoveJoinedLeague() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeJoinedLeague({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOWED_LEAGUES],
      });
    },
  });
}

export function useRemoveBookmarkedLeague() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeBookmarkedLeague({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOWED_LEAGUES],
      });
    },
  });
}

export function useLeaguesForBookmark(query: string) {
  const { token } = useAuth();

  const {
    data: response,
    status,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.LEAGUES_FOR_BOOKMARK, query],
    queryFn: () => getLeaguesForBookmark({ query, token }),
    enabled: query !== '',
    staleTime: query !== '' ? 60000 : 0,
    cacheTime: query !== '' ? 60000 : 0,
  });

  return { response, status, isLoading };
}

export function useAddBookmarkedLeague() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addBookmarkedLeague({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOWED_LEAGUES],
      });
    },
  });
}

export function useLeagueSubscriptionInformation(leagueID: string) {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION, leagueID],
    queryFn: () => getLeagueSubscriptionInformation({ token, leagueID }),
    staleTime: 60000,
  });

  return { response, status };
}

export function useToggleAutoRenewSubscription(leagueID: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isRenewed: boolean) =>
      toggleLeagueSubscriptionAutoRenewal({ token, leagueID, isRenewed }),
    onMutate: async (newValue: boolean) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION, leagueID],
      });

      const previousData = queryClient.getQueryData([
        QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION,
        leagueID,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION, leagueID],
        (old: any) => ({
          ...old,
          has_subscription_autorenewal: newValue,
        })
      );

      return { previousData };
    },

    onError: (err, newValue, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION, leagueID],
        context?.previousData
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LEAGUE_SUBSCRIPTION_INFORMATION, leagueID],
      });
    },
  });
}

export function useLeagueBillingHistory(
  leagueID: string,
  filters: { page: number; query: string }
) {
  const { token } = useAuth();

  const params = new URLSearchParams({
    page: filters.page.toString(),
    ...(filters.query && { search: filters.query }),
    league_id: leagueID,
  }).toString();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.LEAGUE_BILLING_HISTORY, leagueID, filters],
    queryFn: () => getLeagueBillingHistory({ token, params }),
    staleTime: 60000,
  });

  return { response, status };
}
