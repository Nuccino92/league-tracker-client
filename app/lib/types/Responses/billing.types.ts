import WithMessage from './WithMessage.types';

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
