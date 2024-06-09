'use client';

// News, Scores, Schedule, Players, Standings

import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

import ROUTES from '@/app/lib/globals/routes';
import { useAuth } from '@/app/GlobalContext';
import UserDropdown from '@/app/lib/components/UserDropdown';

const leagueOwnerId = 'arandomuserid';

const leageLogo = null;

export default function AppNav() {
  const leagueID = 'aleagueid'; // get this from provider
  const pathname = usePathname();

  const { status, token, user } = useAuth();

  return (
    <div className='flex w-full items-center justify-between bg-primary px-4 py-3'>
      <div className='flex items-center'>
        {leageLogo ? (
          <span className='mr-7 h-8 w-8 rounded-md bg-white'></span>
        ) : (
          <Link
            href={`${ROUTES.LEAGUE}/${leagueID}`}
            className='mr-6 cursor-pointer font-bold text-secondary'
          >
            keepr
          </Link>
        )}
        <nav className='space-x-2 text-sm font-medium text-white'>
          <Link className='transition-all hover:text-secondary' href='#'>
            News
          </Link>
          <Link
            className={classNames(
              pathname === `${ROUTES.LEAGUE}/${leagueID}${ROUTES.GAMES}` &&
                'text-secondary',
              'transition-all hover:text-secondary'
            )}
            href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.GAMES}`}
          >
            Games
          </Link>
          <Link
            className={classNames(
              pathname === `${ROUTES.LEAGUE}/${leagueID}${ROUTES.TEAMS}` &&
                'text-secondary',
              'transition-all hover:text-secondary'
            )}
            href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.TEAMS}`}
          >
            Teams
          </Link>
          <Link
            className={classNames(
              pathname === `${ROUTES.LEAGUE}/${leagueID}${ROUTES.PLAYERS}` &&
                'text-secondary',
              'transition-all hover:text-secondary'
            )}
            href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.PLAYERS}`}
          >
            Players
          </Link>
          <Link
            className={classNames(
              pathname === `${ROUTES.LEAGUE}/${leagueID}${ROUTES.STANDINGS}` &&
                'text-secondary',
              'transition-all hover:text-secondary'
            )}
            href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.STANDINGS}`}
          >
            Standings
          </Link>
          <Link
            className={classNames(
              pathname === `${ROUTES.LEAGUE}/${leagueID}${ROUTES.ABOUT}` &&
                'text-secondary',
              '!ml-8 transition-all hover:text-secondary'
            )}
            href={`${ROUTES.LEAGUE}/${leagueID}${ROUTES.ABOUT}`}
          >
            About
          </Link>
        </nav>
      </div>

      <div>
        {status === 'authenticated' ? (
          <div className='flex items-center space-x-4'>
            {/* {user.id === leagueOwnerId ? (
              <span className='text-sm font-medium text-white'>
                ( League Owner )
              </span>
            ) : null} */}
            <UserDropdown />
          </div>
        ) : (
          <>
            <Link
              className='flex items-center space-x-2 rounded-md border bg-white p-2 text-sm font-medium text-primary transition-all hover:text-secondary'
              href='/login'
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
