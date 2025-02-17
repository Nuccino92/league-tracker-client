'use client';

import Image from 'next/image';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useAuth } from '@/app/GlobalContext';

export default function DashboardHeader() {
  const { user } = useAuth();
  const { leagueData } = useLeagueControlPanel();

  const { league_info } = leagueData;

  const roleLabels = {
    owner: 'Owner',
    'super-admin': 'Super Admin',
    admin: 'Admin',
    'team-manager': 'Team Manager',
    scorekeeper: 'Scorekeeper',
  };

  return (
    <header className='flex items-center justify-between rounded-[22px] bg-gradient-to-r from-primary to-primary/70 px-6 py-8 text-white'>
      <div className='w-full'>
        <div className='mb-2 text-4xl font-bold'>{league_info.name}</div>
        <p className='mb-6 text-gray-300'>{league_info.description}</p>
        <div className='font-bold capitalize'>
          {roleLabels[leagueData.role.role_name]}
        </div>
      </div>

      {league_info.logo && (
        <div className='flex w-full items-center justify-end pr-10'>
          <Image
            src={league_info.logo}
            alt={`${league_info.name} Logo`}
            height={200}
            width={200}
          />{' '}
        </div>
      )}
    </header>
  );
}
