import { useAuth } from '@/app/GlobalContext';
import {
  productListWithPricesRequest,
  setupIntentRequest,
} from '@/app/lib/requests/billing';
import { useQuery } from '@tanstack/react-query';

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
