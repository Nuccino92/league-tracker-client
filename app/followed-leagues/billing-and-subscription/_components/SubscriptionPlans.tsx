'use client';

import { Fragment, useState } from 'react';
import { Switch, Transition } from '@headlessui/react';
import classNames from 'classnames';

import { useGetSubscriptionPlans } from '@/app/lib/hooks/api/billing';
import BillingToggle from '@/app/create/_components/BillingToggle';
import SubscriptionCard from '@/app/create/_components/SubscriptionCard';
import { getMonthlyPriceInAnnualPlan } from '@/app/lib/utils/subscriptionHelpers';
import StyledBox from '@/app/lib/components/StyledBox';
import {
  useLeagueSubscriptionInformation,
  useToggleAutoRenewSubscription,
} from '@/app/lib/hooks/api/followed-leagues';
import { Button } from '@/app/lib/components/Button';
import { differenceInDays, format } from 'date-fns';

type Props = {
  leagueID: string;
};

export default function SubscriptionPlans({ leagueID }: Props) {
  // this is for finding out the users plan information
  const { response: subInformationResponse, status } =
    useLeagueSubscriptionInformation(leagueID);

  const { data, status: plansStatus } = useGetSubscriptionPlans();

  const toggleSubPlanMut = useToggleAutoRenewSubscription(leagueID);

  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  /**
   * @todos
   * action button (allow users to switch plan)
   */

  return (
    <div className='space-y-6'>
      {subInformationResponse && (
        <>
          {/* Sub status */}
          {subInformationResponse.subscription && (
            <StyledBox classes='p-6 flex items-end flex items-center gap-2'>
              {getSubAlertIcon(
                subInformationResponse.subscription.end_date,
                subInformationResponse.has_subscription_autorenewal
                  ? true
                  : false
              )}

              <p className='text-sm text-gray-600'>
                Subscription{' '}
                {subInformationResponse.has_subscription_autorenewal
                  ? 'renews'
                  : 'expires'}{' '}
                on{' '}
                {format(
                  new Date(subInformationResponse.subscription?.end_date),
                  'PPP'
                )}
              </p>
            </StyledBox>
          )}
          <StyledBox classes='p-6'>
            {/* Sub plans */}
            {plansStatus === 'success' && data && (
              <div>
                <header className='mb-6 flex items-center justify-between'>
                  <div>
                    <div className='text-lg font-bold'>
                      Billing & Subscription
                    </div>
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
                    <SubscriptionCard
                      key={plan.id}
                      title={plan.title}
                      price={
                        selectedBilling === 'monthly'
                          ? plan.pricing.monthly
                          : getMonthlyPriceInAnnualPlan(plan)
                      }
                      features={plan.features.map((f) => f.description)}
                      actionButton={{
                        label: subInformationResponse.subscription
                          ? subInformationResponse.subscription?.id === plan.id
                            ? 'Current Plan'
                            : (data?.plans?.find(
                                  (p) =>
                                    p.id ===
                                    subInformationResponse.subscription?.id
                                )?.pricing?.monthly ?? 0) <
                                (plan?.pricing?.monthly ?? 0)
                              ? 'Upgrade'
                              : 'Switch'
                          : 'Choose Plan',
                        action: () => {
                          console.log('hihihi');
                        },
                        disabled:
                          subInformationResponse.subscription?.id === plan.id
                            ? true
                            : false,
                      }}
                      highlight={
                        subInformationResponse.subscription?.id === plan.id
                      }
                    />
                  ))}
                </main>
              </div>
            )}

            {plansStatus === 'loading' && (
              <div>i am loading, possible skeleton</div>
            )}
          </StyledBox>{' '}
          {subInformationResponse.subscription && (
            <StyledBox classes='p-6 flex items-end flex items-center justify-between'>
              <div className='text-sm text-gray-600'>
                Auto-renew subscription
              </div>

              <AutoRenewalSwitch
                disabled={toggleSubPlanMut.isLoading}
                isAutoRenewEnabled={
                  subInformationResponse.has_subscription_autorenewal
                    ? true
                    : false
                }
                onToggle={(value) => {
                  toggleSubPlanMut.mutateAsync(value);
                }}
              />
            </StyledBox>
          )}
        </>
      )}
    </div>
  );
}

function AutoRenewalSwitch({
  isAutoRenewEnabled,
  onToggle,
  disabled = false,
}: {
  isAutoRenewEnabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}) {
  const options = {
    on: {
      label: 'Yes',
      value: true,
      action: () => onToggle(true),
    },
    off: {
      label: 'No',
      value: false,
      action: () => onToggle(false),
    },
  };

  return (
    <Switch
      checked={isAutoRenewEnabled}
      onChange={(isOn) => {
        if (isOn) {
          options.on.action();
        } else {
          options.off.action();
        }
      }}
      disabled={disabled}
      as={Fragment}
    >
      {({ checked }) => (
        <button className='switch grid grid-cols-2 items-center rounded-[10px] bg-slate-50'>
          <div
            className={classNames(
              checked && 'text-white',
              'relative flex h-9 items-center justify-center px-4 text-xs'
            )}
          >
            <span className='z-10'>{options.on.label}</span>
            <Transition
              show={checked}
              enter='transitiont duration-150 transform'
              enterFrom='opacity-0 translate-x-8'
              enterTo='opacity-100 translate-x-0'
              leave='transition duration-150 transform'
              leaveFrom='opacity-100 translate-x-0'
              leaveTo='opacity-0 translate-x-8'
              className='absolute h-full w-full rounded-[10px] border-2 border-slate-50 bg-secondary'
            />
          </div>
          <div
            className={classNames(
              !checked && 'text-white',
              'relative flex h-9 items-center justify-center px-4 text-xs'
            )}
          >
            <span className='z-10'>{options.off.label}</span>
            <Transition
              show={!checked}
              enter='transition duration-150 transform'
              enterFrom='opacity-0 -translate-x-8'
              enterTo='opacity-100 translate-x-0'
              leave='transition duration-150 transform'
              leaveFrom='opacity-100 translate-x-0'
              leaveTo='opacity-0 -translate-x-8'
              className='absolute h-full w-full rounded-[10px] border-2 border-slate-50 bg-secondary'
            />
          </div>
        </button>
      )}
    </Switch>
  );
}

function getSubAlertIcon(experationDate: string, autoRenews: boolean) {
  const daysUntilExpiration = differenceInDays(
    new Date(experationDate),
    new Date()
  );

  const healthyIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-7 text-green-500'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
      />
    </svg>
  );

  const cautionIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-7 text-amber-500'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z'
      />
    </svg>
  );

  return autoRenews
    ? healthyIcon
    : daysUntilExpiration <= 7
      ? cautionIcon
      : healthyIcon;
}
