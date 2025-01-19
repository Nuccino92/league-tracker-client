import {
  ProductListWithPricesResponse,
  SetupIntentResponse,
  SubscriptionPlansResponse,
  subscriptionPlansResponseSchema,
} from '@/app/lib/types/Responses/billing.types';

export async function setupIntentRequest(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/payments/createSetupIntent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw Error('failed to setup intent');

  const { data } = (await response.json()) as SetupIntentResponse;

  return data;
}

export async function productListWithPricesRequest(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}` +
      '/payments/products-with-prices',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw Error('failed to setup intent');

  const data = (await response.json()) as ProductListWithPricesResponse;

  return { data: data.data };
}

export async function test(token: string, paymentMethod: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/payments/test-sub`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_method_id: paymentMethod }),
    }
  );

  if (!response.ok) throw Error('failed to setup intent');

  const data = (await response.json()) as any;

  return data;
}

export async function getSubscriptionPlans({ token }: { token: string }) {
  return new Promise<SubscriptionPlansResponse>((resolve) => {
    setTimeout(() => {
      const result = subscriptionPlansResponseSchema.parse(
        mockSubscriptionPlansResponse
      );
      resolve(result);
    }, 513);
  });

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );

  // if (!response.ok) throw Error('Failed to retrieve league');
}

const mockSubscriptionPlansResponse: SubscriptionPlansResponse = {
  plans: [
    {
      id: 'starter',
      title: 'Starter',
      pricing: {
        monthly: 35,
        yearly: 294,
      },
      messageLimit: {
        email: 750,
        sms: 504620,
      },
      features: [
        {
          description: 'League website',
          included: true,
        },
        {
          description: 'Player registration and online payment collection',
          included: true,
        },
        {
          description: 'Schedule generator',
          included: true,
        },
        {
          description: 'AI generated game summaries',
          included: true,
        },
        {
          description: '500 text messages / month',
          included: true,
        },
        {
          description: '500 emails / month',
          included: true,
        },
      ],
    },
    {
      id: 'pro',
      title: 'Professional',
      pricing: {
        monthly: 55,
        yearly: 462,
      },
      messageLimit: {
        email: 6000,
        sms: 3000,
      },
      features: [
        {
          description: 'League website',
          included: true,
        },
        {
          description: 'Player registration and online payment collection',
          included: true,
        },
        {
          description: 'Schedule generator',
          included: true,
        },
        {
          description: 'AI generated game summaries',
          included: true,
        },
        {
          description: '2000 text messages / month',
          included: true,
        },
        {
          description: '2000 emails / month',
          included: true,
        },
      ],
    },
  ],
};
