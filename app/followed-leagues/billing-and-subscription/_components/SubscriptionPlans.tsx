'use client';

import { useState } from 'react';

import { useGetSubscriptionPlans } from '@/app/lib/hooks/api/billing';
import BillingToggle from '@/app/create/_components/BillingToggle';
import SubscriptionCard from '@/app/create/_components/SubscriptionCard';
import { getMonthlyPriceInAnnualPlan } from '@/app/lib/utils/subscriptionHelpers';
import StyledBox from '@/app/lib/components/StyledBox';
import { useLeagueSubscriptionInformation } from '@/app/lib/hooks/api/followed-leagues';
import { Button } from '@/app/lib/components/Button';

export default function SubscriptionPlans() {
  // this is for finding out the users plan information
  const { response, status } = useLeagueSubscriptionInformation();

  const { data, status: plansStatus } = useGetSubscriptionPlans();

  //todo: make endpoint to get users billing info

  //todo: get the users current plan duration
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  console.log('data', data);

  /**
   * current vs update
   */

  //what happens after i click on a plan? possibly prompt a modal to follow through with transaction

  const hasSub = true;

  return (
    <div className='space-y-6'>
      {/* If has active subscription, show cancel/extend sub box */}
      {hasSub && (
        <StyledBox classes='p-6 flex items-end flex items-center justify-between'>
          <div>information about current subscription</div>
          <div className='space-x-6'>
            <Button>Extend Subscription</Button>
            <Button>Cancel Subscription</Button>
          </div>
        </StyledBox>
      )}
      <StyledBox classes='p-6'>
        {/* Sub plans */}
        {plansStatus === 'success' && data && (
          <div>
            <header className='mb-6 flex items-center justify-between'>
              <div>
                <div className='text-lg font-bold'>Billing & Subscription</div>
                <p className='text-sm text-gray-500'>
                  Select or manage your league&apos;s subscription plan
                </p>
              </div>
              <BillingToggle
                billingPeriod={selectedBilling}
                onChange={(period) => setSelectedBilling(period)}
              />
            </header>

            <main className='flex flex-col items-center justify-center gap-4  sm:flex-row'>
              {data.plans.map((plan) => (
                <div role='button' key={plan.id} onClick={() => {}}>
                  {/* Need to add  button showing current plan or upgrade or downgrade, possibly move this component into a new fold or make new similar component*/}
                  <SubscriptionCard
                    title={plan.title}
                    price={
                      selectedBilling === 'monthly'
                        ? plan.pricing.monthly
                        : getMonthlyPriceInAnnualPlan(plan)
                    }
                    features={plan.features.map((f) => f.description)}
                    //  highlight={values.selected_plan === plan.id}
                  />{' '}
                </div>
              ))}{' '}
            </main>
          </div>
        )}

        {plansStatus === 'loading' && (
          <div>i am loading, possible skeleton</div>
        )}
      </StyledBox>{' '}
    </div>
  );
}
