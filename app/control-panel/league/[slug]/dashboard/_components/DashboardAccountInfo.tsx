'use client';

import { SVGProps } from 'react';
import Link from 'next/link';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import StyledBox from '@/app/lib/components/StyledBox';
import ROUTES from '@/app/lib/globals/routes';

export default function DashboardAccountInfo() {
  const { leagueData } = useLeagueControlPanel();

  /**
   * possible todos:
   *
   * could have different icons for different roles
   */

  const roleLabels = {
    owner: 'Owner',
    'super-admin': 'Super Admin',
    admin: 'Admin',
    'team-manager': 'Team Manager',
    scorekeeper: 'Scorekeeper',
  };

  return (
    <StyledBox classes='flex flex-col gap-2 p-4' boxShadow>
      <div className='mb-4 flex items-center justify-between'>
        <div className='text-sm text-gray-500'>Your Account</div>{' '}
        <Link
          href={`${ROUTES.PROFILE}`}
          className='text-xs font-light underline hover:text-secondary'
        >
          Profile
        </Link>
      </div>

      <div className='flex flex-col items-center gap-2'>
        <AdminOutlined height={50} width={50} className='w-full text-red-900' />
        <div className='text-gray-6000 mt-4 text-center text-sm capitalize'>
          {roleLabels[leagueData.role.role_name]}
        </div>{' '}
      </div>
    </StyledBox>
  );
}

export function AdminOutlined(props: SVGProps<SVGSVGElement>) {
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
        d='M12 23C6.443 21.765 2 16.522 2 11V5l10-4l10 4v6c0 5.524-4.443 10.765-10 12M4 6v5a10.58 10.58 0 0 0 8 10a10.58 10.58 0 0 0 8-10V6l-8-3Z'
      ></path>
      <circle cx='12' cy='8.5' r='2.5' fill='currentColor'></circle>
      <path
        fill='currentColor'
        d='M7 15a5.78 5.78 0 0 0 5 3a5.78 5.78 0 0 0 5-3c-.025-1.896-3.342-3-5-3c-1.667 0-4.975 1.104-5 3'
      ></path>
    </svg>
  );
}
