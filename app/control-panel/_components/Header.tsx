'use client';

import UserDropdown from '@/app/lib/components/UserDropdown';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import classNames from 'classnames';
import { IconBell } from '@/app/lib/SVGs';
import Link from 'next/link';
import ROUTES from '@/app/lib/globals/routes';

export default function Header() {
  const { activeSeason } = useLeagueControlPanel();

  const { sidebar } = useLeagueControlPanel();

  return (
    <header className='flex h-20 items-center justify-between border-b px-10'>
      <div
        className={classNames(
          sidebar.isSidebarExpanded ? 'ml-[250px]' : 'ml-[60px]',
          'text-sm'
        )}
      >
        <span className='text-zinc-900'>
          {activeSeason ? 'Active season' : 'No active season'}{' '}
        </span>{' '}
        {activeSeason && (
          <span className='font-medium text-secondary'>
            {activeSeason.name}
          </span>
        )}
      </div>

      <div className='flex items-center gap-6'>
        <Link href={ROUTES.NOTIFICATIONS}>
          <IconBell height={21} width={21} />
        </Link>
        <UserDropdown />
      </div>
    </header>
  );
}
