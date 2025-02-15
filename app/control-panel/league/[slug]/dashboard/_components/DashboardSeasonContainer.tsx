'use client';

import Link from 'next/link';

import StyledBox from '@/app/lib/components/StyledBox';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import ROUTES from '@/app/lib/globals/routes';
import { SVGProps } from 'react';

/**
 *
 * @returns
 * If league has active season
 * - Active season information
 * - schedule a game
 *
 * else
 * - signify no active season
 * - ui to create/select an active season OR goto the seasons page
 */

export default function DashboardSeasonContainer() {
  const { activeSeason } = useLeagueControlPanel();

  return (
    <div>
      {activeSeason && <WithActiveBusiness />}
      {!activeSeason && <WithoutActiveBusiness />}
    </div>
  );
}

function WithActiveBusiness() {
  const { activeSeason, slug } = useLeagueControlPanel();

  if (!activeSeason) return <></>;

  return (
    <StyledBox classes='p-4 flex flex-col justify-between' boxShadow>
      <div className=''>
        <div className='mb-6 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>Active Season</div>{' '}
          <Link
            href={`/control-panel/league/${slug}/${ROUTES.CONTROL_PANEL_SUBROUTES.SEASONS}?season=${activeSeason.id}`}
            className='text-xs font-light underline hover:text-secondary'
          >
            Manage
          </Link>
        </div>

        <Live24Filled
          height={50}
          width={50}
          className='w-full text-secondary'
        />

        <div className='my-4 break-words text-center text-sm font-medium'>
          {activeSeason?.name}
        </div>
      </div>
      <Link
        href={`/control-panel/league/${slug}/${ROUTES.CONTROL_PANEL_SUBROUTES.SCHEDULE}?season=${activeSeason?.id}`}
        className='w-full'
      >
        <Button className='w-full'>Calendar</Button>
      </Link>
    </StyledBox>
  );
}

function WithoutActiveBusiness() {
  const { slug } = useLeagueControlPanel();

  return (
    <StyledBox classes='p-4 flex flex-col justify-between' boxShadow>
      <div className='mb-6 flex items-center justify-between'>
        <div className='text-sm text-gray-500'>Active Season</div>{' '}
        <Link
          href={`/control-panel/league/${slug}/${ROUTES.CONTROL_PANEL_SUBROUTES.SEASONS}`}
          className='text-xs font-light underline hover:text-secondary'
        >
          Manage
        </Link>
      </div>

      <LiveOff24Filled
        height={50}
        width={50}
        className='w-full text-[#d90d0d]'
      />

      <div className='mt-4 text-center text-sm text-gray-600'>
        No Active Season
      </div>
    </StyledBox>
  );
}

export function Live24Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      {...props}
    >
      <path
        fill='currentColor'
        d='M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3'
      ></path>
    </svg>
  );
}

export function LiveOff24Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      {...props}
    >
      <path
        fill='currentColor'
        d='M3.28 2.22a.75.75 0 1 0-1.06 1.06l2.203 2.203c-3.393 3.93-3.224 9.872.506 13.602a1 1 0 0 0 1.414-1.415a8.004 8.004 0 0 1-.501-10.768l1.52 1.52a5.92 5.92 0 0 0 .533 7.763A1 1 0 0 0 9.31 14.77a3.92 3.92 0 0 1-.513-4.913l1.835 1.836a1.503 1.503 0 0 0 1.45 1.889q.201 0 .388-.051l8.25 8.25a.75.75 0 1 0 1.06-1.061zm15.748 13.626l1.462 1.462c2.414-3.861 1.942-9.012-1.415-12.37a1 1 0 1 0-1.415 1.415a8.01 8.01 0 0 1 1.368 9.493m-3.098-3.098l1.591 1.591a5.92 5.92 0 0 0-1.253-6.527a1 1 0 1 0-1.414 1.414a3.92 3.92 0 0 1 1.076 3.522'
      ></path>
    </svg>
  );
}
