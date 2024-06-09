'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';

import ROUTES from '@/app/lib/globals/routes';
import { ProfileViewType } from '@/app/lib/types/profile.types';
import { useLeagueControlPanel } from './LeagueControlPanelProvider';
import generateNavLinkWithParams from '@/app/lib/utils/generateNavLinkWithParams';

// Have to get features from backend (maybe not depending on business model)

export default function Sidebar({ view }: { view: ProfileViewType }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const { leagueData } = useLeagueControlPanel(); //TODO: conditionally get league or org data

  //TODO: maybe create a hook to apply the current season filter to each url route!!!

  return (
    <div
      className={classNames(
        isSidebarExpanded ? 'w-[300px]' : 'w-[76px]',
        'fixed top-0 z-20 h-screen border-r bg-primary lg:sticky lg:-mt-20'
      )}
    >
      <div className='flex h-20 items-center justify-center space-x-4 px-6 text-center text-xl font-bold text-white'>
        {isSidebarExpanded ? (
          <span className=' line-clamp-2'>
            {leagueData?.league_info.name ?? ''}
          </span>
        ) : null}{' '}
        <button
          className='rounded-full p-1 hover:bg-secondary'
          onClick={() => setIsSidebarExpanded((prev: boolean) => !prev)}
        >
          {menuIcon}
        </button>
      </div>

      <ul className='control-options-container space-y-2 font-medium text-white'>
        {/* TODO: possibly control what is displayed using features from backend */}

        <ControlPanelRoutes
          isSidebarExpanded={isSidebarExpanded}
          pathname={pathname}
          view={view}
        />
      </ul>
    </div>
  );
}
type ControlPanelTypes = {
  isSidebarExpanded: boolean;
  pathname: string;
  view: ProfileViewType;
};

function ControlPanelRoutes({
  isSidebarExpanded,
  pathname,
  view,
}: ControlPanelTypes) {
  const params = useParams();

  const { leagueData } = useLeagueControlPanel();

  const baseRoute = ROUTES.CONTROL_PANEL + '/' + view + '/' + params['slug'];
  return (
    <>
      <li
        className={classNames(pathname === baseRoute ? 'bg-secondary' : '', '')}
      >
        <Link
          href={baseRoute}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{homeIcon}</span> {isSidebarExpanded ? <span>Home</span> : null}
        </Link>
      </li>
      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.MEMBERS
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.MEMBERS}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{membersIcon}</span>{' '}
          {isSidebarExpanded ? <span>Members</span> : null}
        </Link>
      </li>
      {/* <li
          className={classNames(
            pathname === ROUTES.CONTROL_PANEL + '/divisions'
              ? 'bg-secondary'
              : '',
            ''
          )}
        >
          <Link
            href={`${ROUTES.CONTROL_PANEL}/divisions`}
            className={classNames(
              isSidebarExpanded ? 'justify-start' : '',
              'flex items-center space-x-3 px-6 py-2'
            )}
          >
            <span>{divisonIcon}</span>{' '}
            {isSidebarExpanded ? <span>Divisions</span> : null}
          </Link>
        </li> */}
      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.TEAMS
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={generateNavLinkWithParams(
            baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.TEAMS,
            { season: leagueData.seasons.active_season_id }
          )}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{teamIcon}</span>{' '}
          {isSidebarExpanded ? <span>Teams</span> : null}
        </Link>
      </li>
      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PLAYERS
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={generateNavLinkWithParams(
            baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PLAYERS,
            { season: leagueData.seasons.active_season_id }
          )}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{playerIcon}</span>{' '}
          {isSidebarExpanded ? <span>Players</span> : null}
        </Link>
      </li>
      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.CALENDAR
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.CALENDAR}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{calendarIcon}</span>{' '}
          {isSidebarExpanded ? <span>Calendar</span> : null}
        </Link>
      </li>
      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PAYMENTS
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PAYMENTS}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{paymentsIcon}</span>{' '}
          {isSidebarExpanded ? <span>Payments</span> : null}
        </Link>
      </li>

      <li
        className={classNames(
          pathname === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PAYMENTS
            ? 'bg-secondary'
            : '',
          ''
        )}
      >
        <Link
          href={baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.NEWS}
          className={classNames(
            isSidebarExpanded ? 'justify-start' : '',
            'flex items-center space-x-3 px-6 py-2'
          )}
        >
          <span>{newsIcon}</span> {isSidebarExpanded ? <span>News</span> : null}
        </Link>
      </li>
    </>
  );
}

// type ProfileTypes = {
//   isSidebarExpanded: boolean;
//   pathname: string;
// };

// function ProfilePanelRoutes({ isSidebarExpanded, pathname }: ProfileTypes) {
//   const baseRoute = ROUTES.PROFILE;

//   return (
//     <>
//       <li
//         className={classNames(pathname === baseRoute ? 'bg-secondary' : '', '')}
//       >
//         <Link
//           href={baseRoute}
//           className={classNames(
//             isSidebarExpanded ? 'justify-start' : '',
//             'flex items-center space-x-3 px-6 py-2'
//           )}
//         >
//           <span>{homeIcon}</span> {isSidebarExpanded ? <span>Home</span> : null}
//         </Link>
//       </li>

//       <li
//         className={classNames(
//           pathname === baseRoute + ROUTES.PROFILE_SUBROUTES.LEAGUES_ORGS
//             ? 'bg-secondary'
//             : '',
//           ''
//         )}
//       >
//         <Link
//           href={baseRoute + ROUTES.PROFILE_SUBROUTES.LEAGUES_ORGS}
//           className={classNames(
//             isSidebarExpanded ? 'justify-start' : '',
//             'flex items-center space-x-3 px-6 py-2'
//           )}
//         >
//           <span>{organizationIcon}</span>{' '}
//           {isSidebarExpanded ? <span>Leagues & Orgs</span> : null}
//         </Link>
//       </li>
//     </>
//   );
// }

const menuIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
    />
  </svg>
);

const homeIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
    />
  </svg>
);

const membersIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
    />
  </svg>
);

const divisonIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z'
    />
  </svg>
);

const teamIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
    />
  </svg>
);

const playerIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
    />
  </svg>
);

const calendarIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
    />
  </svg>
);

const paymentsIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
    />
  </svg>
);

const newsIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'
    />
  </svg>
);

const organizationIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-7 w-7'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
    />
  </svg>
);
