import { SubscriptionPlan } from '@/app/lib/types/Responses/billing.types';

export const getMonthlyPriceInAnnualPlan = (plan: SubscriptionPlan): number => {
  return Math.round(plan.pricing.yearly / 12);
};

// Could add other subscription-related utils here
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
