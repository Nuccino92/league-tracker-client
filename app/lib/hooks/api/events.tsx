import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { useAuth } from '@/app/GlobalContext';
import {
  getEventsRequest,
  addEventRequest,
  updateEventRequest,
  deleteEventRequest,
} from '@/app/lib/requests/events';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { CreateEvent } from '@/app/lib/types/Resources/CreateEventResource';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { SearchParamScope } from '@/app/lib/types/filters.types';

export function useEvents({
  date,
  teamIds = [],
  includeOnly = [],
}: {
  date: string;
  teamIds?: Array<string | number>;
  includeOnly?: SearchParamScope;
}) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
  const { createQueryString } = useQueryString();

  const params = createQueryString('teams', teamIds, includeOnly);

  const { data: events, status } = useQuery({
    queryKey: [
      QUERY_KEYS.EVENTS.LEAGUE_EVENTS,
      slug,
      format(date, 'yyyy-MM'),
      params,
    ],
    queryFn: () => getEventsRequest({ slug, token, date, params }),
    staleTime: 60000,
  });

  return { events, status };
}

export function useAddEvent() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: CreateEvent) =>
      addEventRequest({ token, slug, eventData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS.LEAGUE_EVENTS],
      });
    },
  });
}

export function useUpdateEvent() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
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

export function useDeleteEvent() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
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
