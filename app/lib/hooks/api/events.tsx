import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import { getEvents } from '../../requests/events';

export function useGetEvents(slug: string, teamSlugs?: string[]) {
  const { token } = useAuth();

  const { data: events, status } = useQuery({
    queryKey: ['events', slug, teamSlugs],
    queryFn: () => getEvents({ slug, token, teamSlugs }),
  });

  return { events, status };
}

export function useAddEvent() {
  const { token } = useAuth();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
}
