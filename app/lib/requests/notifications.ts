import {
  NotificationResponse,
  notificationResponseSchema,
} from '@/app/lib/types/notification.types';

export async function getNotifications({ token }: { token: string }) {
  return new Promise<NotificationResponse>((resolve) => {
    setTimeout(() => {
      const result = notificationResponseSchema.parse(mockNotifications);
      resolve(result);
    }, 608);
  });
}

const mockNotifications: NotificationResponse = {
  meta: {
    current_page: 1,
    last_page: 4,
    to: 0,
    from: 0,
    path: '',
    per_page: 0,
    total: 11,
    links: [],
  },
  data: [
    {
      id: 342234,
    },
    {
      id: 3422345,
    },
    {
      id: 34234232234,
    },
    {
      id: 342234656,
    },
    {
      id: 3544542234,
    },
    {
      id: 3422433534,
    },
    {
      id: 335442234,
    },
  ],
};

export async function markAllNotificationsAsReadRequest({
  token,
}: {
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(true);
    }, 608);
  });
}

export async function deleteAllNotificationsRequest({
  token,
}: {
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(true);
    }, 608);
  });
}

export async function markNotificationsAsReadRequest({
  token,
  ids,
}: {
  token: string;
  ids: number[];
}) {
  console.log('markNotificationsAsReadRequest', ids);

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(true);
    }, 608);
  });
}

export async function deleteNotificationsRequest({
  token,
  ids,
}: {
  token: string;
  ids: number[];
}) {
  console.log('deleteNotificationsRequest', ids);

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(true);
    }, 608);
  });
}
