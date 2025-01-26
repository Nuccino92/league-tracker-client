import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';
import {
  deleteAllNotificationsRequest,
  deleteNotificationsRequest,
  getNotifications,
  getNotificationSettings,
  markAllNotificationsAsReadRequest,
  markNotificationsAsReadRequest,
  toggleNotification,
} from '@/app/lib/requests/notifications';
import { NotificationType } from '@/app/lib/types/notification.types';
import { NotificationTabOptions } from '@/app/notifications/types';

export function useNotifications({
  page,
  selectedTab,
  showOnlyUnreads,
}: {
  page: number;
  selectedTab: NotificationTabOptions;
  showOnlyUnreads: boolean;
}) {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, page, selectedTab, showOnlyUnreads],
    queryFn: () =>
      getNotifications({ token, page, selectedTab, showOnlyUnreads }),
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

export function useNotificationSettings() {
  const { token } = useAuth();

  const { data: response, status } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION_SETTINGS],
    queryFn: () => getNotificationSettings({ token }),
    staleTime: 60000,
  });

  return { response, status };
}

export function useNotificationSettingsToggle() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      isChecked,
    }: {
      type: NotificationType;
      isChecked: boolean;
    }) => toggleNotification({ token, type, isChecked }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATION_SETTINGS],
      });
    },
  });
}
