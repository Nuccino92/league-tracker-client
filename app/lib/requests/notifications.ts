import {
  NotificationResponse,
  notificationResponseSchema,
  NotificationSettingsResponse,
  NotificationType,
} from '@/app/lib/types/notification.types';
import { NotificationTabOptions } from '@/app/notifications/types';

export async function getNotifications({
  token,
  page,
  selectedTab,
  showOnlyUnreads,
}: {
  token: string;
  page: number;
  selectedTab: NotificationTabOptions;
  showOnlyUnreads: boolean;
}) {
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
    last_page: 11,
    to: 0,
    from: 0,
    path: '',
    per_page: 0,
    total: 7,
    links: [],
  },
  data: [
    {
      id: 1,
      type: 'league_invite',
      title: 'Join Premier League',
      message: "You've been invited to join Premier League as an admin",
      url: 'http://localhost:3000/followed-leagues',
      created_at: '2024-01-26T10:00:00Z',
      is_read: false,
      league_id: 1,
      sender: {
        id: 1,
        name: 'John Smith',
      },
      metadata: {
        role: 'admin',
      },
      expires_at: '2024-02-26T10:00:00Z',
    },
    {
      id: 2,
      type: 'admin_message',
      title: 'Important Announcement',
      message: 'Game schedule has been updated for next week',
      url: null,
      created_at: '2024-01-25T15:30:00Z',
      is_read: true,
      league_id: 2,
      sender: {
        id: 2,
        name: 'Admin Sarah',
      },
      metadata: null,
      expires_at: null,
    },
    {
      id: 3,
      type: 'registration_capacity',
      title: 'Registration Limit Reached',
      message: 'Your league has reached maximum registration capacity',
      url: 'http://localhost:3000/control-panel/league/oh-mah-gawd/registrations',
      created_at: '2024-01-24T09:15:00Z',
      is_read: false,
      league_id: 3,
      sender: null,
      metadata: {
        current_count: 100,
        max_capacity: 100,
      },
      expires_at: null,
    },
    {
      id: 4,
      type: 'subscription_purchased',
      title: 'Subscription Activated',
      message: 'Your Professional plan subscription is now active',
      url: 'http://localhost:3000/followed-leagues/billing-and-subscription/3',
      created_at: '2024-01-23T11:00:00Z',
      is_read: true,
      league_id: null,
      sender: null,
      metadata: {
        plan: 'professional',
        amount: 55.0,
      },
      expires_at: null,
    },
    {
      id: 5,
      type: 'subscription_expiring_week',
      title: 'Subscription Expiring Soon',
      message: 'Your subscription will expire in 7 days',
      url: 'http://localhost:3000/followed-leagues/billing-and-subscription/3',
      created_at: '2024-01-22T16:45:00Z',
      is_read: false,
      league_id: null,
      sender: null,
      metadata: {
        expiry_date: '2024-01-29T16:45:00Z',
      },
      expires_at: '2024-01-29T16:45:00Z',
    },
    {
      id: 6,
      type: 'subscription_expiring_three_days',
      title: 'Final Subscription Notice',
      message: 'Your subscription expires in 3 days',
      url: 'http://localhost:3000/followed-leagues/billing-and-subscription/3',
      created_at: '2024-01-26T16:45:00Z',
      is_read: false,
      league_id: null,
      sender: null,
      metadata: {
        expiry_date: '2024-01-29T16:45:00Z',
      },
      expires_at: '2024-01-29T16:45:00Z',
    },
    {
      id: 7,
      type: 'subscription_updated',
      title: 'Plan Upgraded',
      message: 'Your subscription has been upgraded to Professional',
      url: 'http://localhost:3000/followed-leagues/billing-and-subscription/3',
      created_at: '2024-01-21T14:20:00Z',
      is_read: true,
      league_id: null,
      sender: null,
      metadata: {
        old_plan: 'starter',
        new_plan: 'professional',
      },
      expires_at: null,
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

export async function getNotificationSettings({ token }: { token: string }) {
  return new Promise<NotificationSettingsResponse>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(mockNotificationSettings);
    }, 608);
  });
}

const mockNotificationSettings: NotificationSettingsResponse = {
  notification_types: [
    {
      type: 'league_invite',
      name: 'League Invitations',
      description: 'When you receive an invitation to join a league',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'admin_message',
      name: 'League Admin Messages',
      description: 'Messages from league administrators',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'registration_capacity',
      name: 'Registration Capacity',
      description: 'When your league reaches maximum registration capacity',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'subscription_purchased',
      name: 'Subscription Purchase',
      description: 'When a subscription is successfully purchased',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'subscription_expiring_week',
      name: 'Subscription Expiring (1 Week)',
      description: 'When your subscription is expiring within a week',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'subscription_expiring_three_days',
      name: 'Subscription Expiring (3 Days)',
      description: 'When your subscription is expiring in three days',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
    {
      type: 'subscription_updated',
      name: 'Subscription Changes',
      description: 'When changes are made to your subscription',
      in_app_enabled: true,
      email_enabled: true,
      sms_enabled: false,
    },
  ],
};

export async function toggleNotification({
  token,
  type,
  isChecked,
}: {
  token: string;
  type: NotificationType;
  isChecked: boolean;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      //  const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(true);
    }, 308);
  });
}
