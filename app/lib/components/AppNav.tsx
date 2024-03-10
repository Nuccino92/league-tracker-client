'use client';

// News, Scores, Schedule, Players, Standings

import { Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import ROUTES from '@/app/lib/routesConfig';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/GlobalContext';
import { signOut } from 'next-auth/react';
import logOut from '@/app/lib/utils/logOut';

const leagueOwnerId = 'arandomuserid';

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
} | null;

// const user: UserType = {
//   id: "arandomuserid",
//   firstName: "Anthony",
//   lastName: "Nucci",
// };
const user: UserType = null;
const leageLogo = null;

export default function AppNav() {
  const leagueID = 'aleagueid'; // get this from provider
  const pathname = usePathname();

  const { status, token } = useAuth();

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
          <Link className='transition-all hover:text-secondary' href='#'>
            Scores
          </Link>
          <Link className='transition-all hover:text-secondary' href='#'>
            Schedule
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
        {user ? (
          <div className='flex items-center space-x-4'>
            {user.id === leagueOwnerId ? (
              <span className='text-sm font-medium text-white'>
                ( League Owner )
              </span>
            ) : null}
            <Menu as='div' className='relative'>
              <Menu.Button className='flex items-center space-x-2 rounded-md border bg-white p-2 text-sm font-medium text-primary'>
                <span> {user.firstName}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <div className='absolute right-0 mt-2 divide-y divide-gray-100 overflow-hidden rounded-md bg-white py-2 text-center shadow-lg'>
                  <Menu.Items>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          className={`whitespace-nowrap p-4 text-sm font-medium ${
                            active && 'bg-secondary text-white transition-all'
                          }`}
                          href={`/profile/${user.id}`}
                        >
                          View Profile
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>{' '}
                </div>
              </Transition>
            </Menu>
          </div>
        ) : (
          <>
            {status === 'authenticated' ? (
              <button
                className='flex items-center space-x-2 rounded-md border bg-white p-2 text-sm font-medium text-primary transition-all hover:text-secondary'
                onClick={() => logOut(token)}
              >
                Sign Out
              </button>
            ) : (
              <Link
                className='flex items-center space-x-2 rounded-md border bg-white p-2 text-sm font-medium text-primary transition-all hover:text-secondary'
                href='/login'
              >
                Sign In
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
