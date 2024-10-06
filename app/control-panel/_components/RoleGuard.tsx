'use client';

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLeagueControlPanel } from './LeagueControlPanelProvider';
import { ControlPanelLeaguePages } from '@/app/lib/enums';
import NotFound from '@/app/lib/components/NotFound';
import Link from 'next/link';

type Props = {
  children: ReactNode;
};

/**
 *
 * @param param0
 * @returns
 *
 * Possibly change to League role guard as it uses league data and not org data
 */

export default function RoleGuard({ children }: Props) {
  const router = useRouter();

  const { hasPageAccess } = useLeagueControlPanel();

  const page = useGetControlPanelPage();
  const pageAccess = hasPageAccess(page);

  if (!pageAccess)
    return (
      <NotFound>
        <div className='text-2xl font-bold'>
          You do not have access to this page
        </div>
        <div className='mt-6 flex items-center justify-center space-x-5 font-medium text-white'>
          <Link
            className='flex h-10 items-center justify-center rounded bg-secondary px-4'
            href={'/'}
          >
            Home
          </Link>
          <button
            className='h-10 rounded bg-primary px-4'
            onClick={() => router.back()}
            type='button'
          >
            Back
          </button>
        </div>
      </NotFound>
    );

  return <>{children}</>;
}

function useGetControlPanelPage(): ControlPanelLeaguePages {
  const pathname = usePathname();

  if (pathname.includes('home')) {
    return ControlPanelLeaguePages.HOME;
  }
  if (pathname.includes('members')) {
    return ControlPanelLeaguePages.MEMBERS;
  }
  if (pathname.includes('seasons')) {
    return ControlPanelLeaguePages.SEASONS;
  }
  //Todo: need to guard against specific teams. Page /teams/(teamid). Need to check user scope
  if (pathname.includes('teams')) {
    return ControlPanelLeaguePages.TEAMS;
  }
  if (pathname.includes('players')) {
    return ControlPanelLeaguePages.PLAYERS;
  }
  if (pathname.includes('calendar')) {
    return ControlPanelLeaguePages.CALENDAR;
  }
  if (pathname.includes('registrations')) {
    return ControlPanelLeaguePages.REGISTRATIONS;
  }
  if (pathname.includes('news')) {
    return ControlPanelLeaguePages.NEWS;
  }

  return ControlPanelLeaguePages.INDEX;
}
