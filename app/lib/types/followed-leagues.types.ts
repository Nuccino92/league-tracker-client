import { z } from 'zod';

import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';

const leagueSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
});

export type FollowedLeague = z.infer<typeof leagueSchema>;

export const followedLeaguesResponseSchema = z.object({
  joined_leagues: z.array(
    leagueSchema.extend({
      role: z.enum([
        'owner',
        'super-admin',
        'admin',
        'team-manager',
        'scorekeeper',
        'invitation',
      ]), // todo: make/get enum
    })
  ),
  bookmarked_leagues: z.array(leagueSchema),
});

export type FollowedLeagueResponse = z.infer<
  typeof followedLeaguesResponseSchema
>;

export const leaguesForBookmarkResponseSchema = z.array(leagueSchema);

export type LeaguesForBookmarkResponse = z.infer<
  typeof leaguesForBookmarkResponseSchema
>;

export const leagueSubscriptionInformationSchema = z.object({
  subscription: z
    .object({
      id: z.string(),
      name: z.string(),
      start_date: z.string(),
      end_date: z.string(),
      billing_frequency: z.enum(['monthly', 'yearly']),
    })
    .nullable(),

  has_subscription_autorenewal: z.boolean().nullable(),
});

export type LeagueSubscriptionInformation = z.infer<
  typeof leagueSubscriptionInformationSchema
>;

export const billingStatusSchema = z.enum([
  'succeeded',
  'pending',
  'failed',
  'processing',
  'refunded',
  'cancelled',
]);

export type BillingStatus = z.infer<typeof billingStatusSchema>;

export const leagueBillingHistoryItemResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      product_name: z.string(),
      amount: z.number(),
      currency: z.string(),
      purchase_date: z.string(),
      end_date: z.string(),
      status: billingStatusSchema,

      //possibly send url's to view etc
    })
  ),
  meta: PaginationMetaSchema,
});

export type LeagueBillingHistoryItemResponse = z.infer<
  typeof leagueBillingHistoryItemResponseSchema
>;
