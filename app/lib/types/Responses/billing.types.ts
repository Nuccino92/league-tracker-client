import { z } from 'zod';

import WithMessage from '@/app/lib/types/Responses/WithMessage.types';

export type SetupIntentResponse = {
  data: {
    client_secret: string;
    setup_intent: string | null;
    status: 'succeeded' | 'processing' | 'requires_payment_method';
  };
} & WithMessage;

export type ProductListWithPricesResponse = {
  data: Product[];
} & WithMessage;

type Price = {
  id: string;
  metadata: {
    website: 'true' | 'false';
  };
  recurring: {
    aggregate_usage: null | string;
    interval: 'year' | 'month';
    interval_count: number;
    meter: null | string;
    trial_period_days: null | number;
    usage_type: 'licensed';
  };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  default_price: string;
  prices: Price[];
};

const subscriptionPriceSchema = z.object({
  monthly: z.number(),
  yearly: z.number(),
});

const messageLimitSchema = z.object({
  email: z.number(),
  sms: z.number(),
});

const featureSchema = z.object({
  description: z.string(),
  included: z.boolean(),
});

const subscriptionPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  pricing: subscriptionPriceSchema,
  messageLimit: messageLimitSchema,
  features: z.array(featureSchema),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const subscriptionPlansResponseSchema = z.object({
  plans: z.array(subscriptionPlanSchema),
});

export type SubscriptionPlansResponse = z.infer<
  typeof subscriptionPlansResponseSchema
>;
