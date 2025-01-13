'use client';

import Image from 'next/image';

import { useAuth } from '@/app/GlobalContext';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import getEnumKeyByEnumValue from '@/app/lib/utils/getEnumKeyByEnumValue';
import { MemberRolesEnum } from '@/app/lib/enums';
import PageHeader from '@/app/control-panel/_components/PageHeader';

export default function IndexContent() {
  const { user } = useAuth();
  const { leagueData } = useLeagueControlPanel();

  return (
    <div className='h-[50vh]'>
      <PageHeader text={`Control Panel - ${leagueData.league_info.name}`} />{' '}
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex max-w-[600px] flex-col items-center justify-center'>
          {leagueData.league_info.logo ? (
            <Image
              src={leagueData.league_info.logo}
              alt={`${leagueData.league_info.name} Logo`}
              height={140}
              width={140}
              className='mb-6'
            />
          ) : null}
          <div className='flex items-center justify-between space-x-6'>
            <h3 className='text-2xl font-medium'>Welcome, {user?.name}</h3>{' '}
          </div>
          <div className='mb-4 mt-1 text-sm'>
            <span className='italic text-zinc-600'>Membership status:</span>{' '}
            <span className='font-medium'>
              {getEnumKeyByEnumValue(
                MemberRolesEnum,
                leagueData.role.role_name
              )}
            </span>
          </div>
          <div></div>
          <p className='text-sm text-zinc-900'>
            {leagueData.league_info.description}
          </p>{' '}
        </div>
      </div>
    </div>
  );
}
