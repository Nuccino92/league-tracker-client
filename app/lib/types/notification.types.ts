import { z } from 'zod';

import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';

export const notificationItemSchema = z.object({
  id: z.number(),
});

export type NotificationItem = z.infer<typeof notificationItemSchema>;

export const notificationResponseSchema = z.object({
  meta: PaginationMetaSchema,
  data: z.array(notificationItemSchema),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
