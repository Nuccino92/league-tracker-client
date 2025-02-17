'use client';

import Link from 'next/link';
import { differenceInDays, format, parseISO } from 'date-fns';

import StyledBox from '@/app/lib/components/StyledBox';
import ROUTES from '@/app/lib/globals/routes';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useLeagueSubscriptionInformation } from '@/app/lib/hooks/api/followed-leagues';

export default function DashboardLeagueSubscriptionInformation() {
  const { leagueData } = useLeagueControlPanel();

  const { response: subInformationResponse, status } =
    useLeagueSubscriptionInformation(leagueData.league_info.id);

  if (leagueData.role.role_name !== 'owner') return <></>;

  return (
    <StyledBox classes='flex flex-col gap-2 p-4' boxShadow>
      <div className='mb-4 flex items-center justify-between'>
        <div className='text-sm text-gray-500'>Subscription Info</div>{' '}
        <Link
          href={`${ROUTES.BILLING_AND_SUBSCRIPTION}/${leagueData.league_info.id}`}
          className='text-xs font-light underline hover:text-secondary'
        >
          Manage
        </Link>
      </div>
      <div>
        {status === 'success' &&
        subInformationResponse &&
        subInformationResponse.subscription ? (
          <>
            <div className='flex w-full items-center justify-center'>
              {getSubAlertIcon(
                subInformationResponse.subscription.end_date,
                subInformationResponse.has_subscription_autorenewal
                  ? true
                  : false
              )}
            </div>
            <p className='mt-4 text-center text-sm text-gray-600'>
              Subscription{' '}
              {subInformationResponse.has_subscription_autorenewal
                ? 'renews'
                : 'expires'}{' '}
              on{' '}
              {format(
                parseISO(subInformationResponse.subscription.end_date),
                'PPP'
              )}
            </p>
          </>
        ) : null}

        {status === 'loading' && (
          <div className='flex h-[105px] w-full flex-col items-center justify-center'>
            <div className=' size-[50px] animate-pulse rounded-md bg-gray-200' />

            <div className='mt-4 h-10 w-full animate-pulse rounded-md bg-gray-200' />
          </div>
        )}
      </div>
    </StyledBox>
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
      className='size-[50px] text-secondary'
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
      className='size-[50px] text-amber-500'
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
