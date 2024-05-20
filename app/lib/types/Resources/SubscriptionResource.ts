import { z } from 'zod';

export const subscriptionSchema = z.object({
  payment_method_id: z.string(),
  product_id: z.string(),
  price_id: z.string(),
});

export type SubscriptionInformationSchema = z.infer<typeof subscriptionSchema>;
