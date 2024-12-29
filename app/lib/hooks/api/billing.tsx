import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/app/GlobalContext';
import {
  getSubscriptionPlans,
  productListWithPricesRequest,
  setupIntentRequest,
} from '@/app/lib/requests/billing';
import QUERY_KEYS from '@/app/lib/globals/queryKeys';

//TODO: setup query keys
export function useSetupIntent() {
  const { token } = useAuth();
  const { data, status } = useQuery({
    queryKey: ['setup-intent'],
    queryFn: () => setupIntentRequest(token),
  });

  return { data, status };
}

export function useProductWithPricesList() {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: ['product-list'],
    queryFn: () => productListWithPricesRequest(token),
    staleTime: 300000,
  });

  return { data, status };
}

export function useGetSubscriptionPlans() {
  const { token } = useAuth();

  const { data, status } = useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIPTION_PLANS],
    queryFn: () => getSubscriptionPlans({ token }),
  });

  return { data, status };
}
