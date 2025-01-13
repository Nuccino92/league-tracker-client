import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  addBookmarkedLeague,
  getFollowedLeagues,
  getLeaguesForBookmark,
  removeBookmarkedLeague,
  removeJoinedLeague,
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

export function useLeagueSubscriptionInformation() {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.FOLLOWED_LEAGUES],
    queryFn: () => getFollowedLeagues({ token }),
    staleTime: 60000,
  });

  return { response, status };
}
