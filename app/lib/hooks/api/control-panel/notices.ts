import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  createNotice,
  fetchNoticeDetails,
  fetchNoticeList,
  fetchNoticeSelectionScopeTotals,
  fetchNoticeStatistics,
  retryNotice,
} from '@/app/lib/requests/control-panel/notices';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { SearchParamScope } from '@/app/lib/types/filters.types';
import useQueryString from '@/app/lib/hooks/useQueryString';

export function useNoticeList({
  enabled = true,
  includeOnly = [],
  givenParams,
}: {
  enabled?: boolean;
  includeOnly?: SearchParamScope;
  givenParams?: string;
}) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { scopeQueryParams } = useQueryString();
  const params = givenParams ? givenParams : scopeQueryParams(includeOnly);

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_LIST, slug, params],
    queryFn: () => fetchNoticeList({ token, slug, params }),
    staleTime: 30000,
  });

  return { response, status };
}

export function useNoticeDetails({
  noticeId,
  page,
  query,
}: {
  noticeId: number;
  page?: number;
  query?: string;
}) {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const params = `page=${page || 1}&query=${query || ''}`;

  const { data: response, status } = useQuery({
    queryKey: [
      QUERY_KEYS.CONTROL_PANEL.NOTICES_DETAILS,
      slug,
      noticeId,
      params,
    ],
    queryFn: () => fetchNoticeDetails({ token, slug, noticeId, params }),
    staleTime: 30000,
  });

  return { response, status };
}

export function useNoticeStatistics() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_STATISTICS, slug],
    queryFn: () => fetchNoticeStatistics({ token, slug }),
    staleTime: 30000,
  });

  return { data, status };
}

export function useCreateNotice() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      noticeData: any //TODO: define noticeData type
    ) => createNotice({ token, slug, noticeData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_STATISTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_LIST],
      });
    },
  });
}

export function useRetryNotices() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => retryNotice({ token, slug, noticeId }),
    onSuccess: () => {
      // could toast here
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_STATISTICS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICES_LIST],
      });
    },
  });
}

export function useNoticeSelectionScopeTotals() {
  const { token } = useAuth();
  const { slug } = useLeagueControlPanel();

  const { data: totals, status } = useQuery({
    queryKey: [QUERY_KEYS.CONTROL_PANEL.NOTICE_SELECTION_SCOPE_TOTALS, slug],
    queryFn: () => fetchNoticeSelectionScopeTotals({ token, slug }),
  });

  return { totals, status };
}
