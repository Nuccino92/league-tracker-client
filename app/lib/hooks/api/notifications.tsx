import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  deleteAllNotificationsRequest,
  deleteNotificationsRequest,
  getNotifications,
  markAllNotificationsAsReadRequest,
  markNotificationsAsReadRequest,
} from '@/app/lib/requests/notifications';

export function useNotifications() {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: () => getNotifications({ token }),
    staleTime: 60000,
  });

  return { response, status };
}

export function useMarkAllNotificationsAsRead() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsReadRequest({ token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
  });
}

export function useMarkNotificationsAsRead() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) =>
      markNotificationsAsReadRequest({ token, ids }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
  });
}

export function useDeleteAllNotifications() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllNotificationsRequest({ token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
  });
}

export function useDeleteSelectedNotifications() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteNotificationsRequest({ token, ids }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
  });
}
