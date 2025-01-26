import { z } from 'zod';

import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';

export const notificationTypes = [
  'league_invite',
  'admin_message',
  'registration_capacity', //With every registation we have to check if max capacity is reached, if it is there we send a notification to the owner & super admins
  'subscription_purchased', // league owner level
  'subscription_expiring_week', // league owner level
  'subscription_expiring_three_days', // league owner level
  'subscription_updated', // league owner level
] as const;

// Need to add translations, could move into jsx for i18n
export const notificationTypeLabels: Record<NotificationType, string> = {
  league_invite: 'League Invite',
  admin_message: 'Admin Message',
  registration_capacity: 'Registration Capacity',
  subscription_purchased: 'Subscription Purchased',
  subscription_expiring_week: 'Subscription Expiring Soon',
  subscription_expiring_three_days: 'Subscription Expiring in 3 Days',
  subscription_updated: 'Subscription Updated',
};

export const notificationTypeSchema = z.enum(notificationTypes);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationItemSchema = z.object({
  id: z.number(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  url: z.string().nullable(),
  created_at: z.string().datetime(),
  is_read: z.boolean(),
  league_id: z.number().nullable(),
  sender: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  metadata: z.record(z.unknown()).nullable(),
  expires_at: z.string().datetime().nullable(),
});

export type NotificationItem = z.infer<typeof notificationItemSchema>;

export const notificationResponseSchema = z.object({
  meta: PaginationMetaSchema,
  data: z.array(notificationItemSchema),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;

export const notificationSettingSchema = z.object({
  name: z.string(),
  type: notificationTypeSchema,
  description: z.string(),
  in_app_enabled: z.boolean(),
  email_enabled: z.boolean(),
  sms_enabled: z.boolean(),
});

export type NotificationSettings = z.infer<typeof notificationSettingSchema>;

export const notificationSettingsResponseSchema = z.object({
  notification_types: z.array(notificationSettingSchema),
});

export type NotificationSettingsResponse = z.infer<
  typeof notificationSettingsResponseSchema
>;
