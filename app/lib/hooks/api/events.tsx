import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  getEventsRequest,
  addEventRequest,
  updateEventRequest,
  deleteEventRequest,
} from '@/app/lib/requests/events';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';

export function useGetEvents(slug: string, teamSlugs?: string[]) {
  const { token } = useAuth();

  const { data: events, status } = useQuery({
    queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS, slug, teamSlugs],
    queryFn: () => getEventsRequest({ slug, token, teamSlugs }),
    staleTime: 60000,
  });

  return { events, status };
}

export function useAddEvent(slug: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useMutation({
    mutationFn: (eventID: number) => addEventRequest({ token, id: eventID }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS],
      });
    },
  });
}

export function useUpdateEvent(slug: number) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useMutation({
    mutationFn: (eventID: number) => updateEventRequest({ token, id: eventID }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS],
      });
    },
  });
}

export function useDeleteEvent(slug: string) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventID: number) =>
      deleteEventRequest({ token, slug, eventID }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS],
      });
    },
  });
}
