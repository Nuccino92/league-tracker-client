'use client';

import { FC, SVGProps, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';

import ROUTES from '@/app/lib/globals/routes';
import { ProfileViewType } from '@/app/lib/types/profile.types';
import { useLeagueControlPanel } from './LeagueControlPanelProvider';
import generateNavLinkWithParams from '@/app/lib/utils/generateNavLinkWithParams';
import { SIDEBAR_LINK_CLASSES } from '@/app/lib/globals/styles';
import { ControlPanelLeaguePages } from '@/app/lib/enums';

// Have to get features from backend (maybe not depending on business model)

export default function Sidebar({ view }: { view: ProfileViewType }) {
  const pathname = usePathname();
  const { sidebar } = useLeagueControlPanel();

  return (
    <div
      className={classNames(
        sidebar.isSidebarExpanded ? 'w-[300px]' : 'w-[76px]',
        'fixed top-0 z-50 h-screen border-r bg-white lg:sticky lg:-mt-20'
      )}
    >
      <button
        className='absolute right-0 p-1 text-primary transition-colors duration-75 ease-out hover:text-secondary'
        onClick={sidebar.toggleSidebar}
      >
        {sidebar.isSidebarExpanded ? (
          <IconArrowLeftSquare height={26} width={26} />
        ) : (
          <IconArrowRightSquare height={26} width={26} />
        )}
      </button>

      <ul className='control-options-container mt-[100px] space-y-2 font-bold text-primary/50'>
        <ControlPanelRoutes pathname={pathname} view={view} />
      </ul>
    </div>
  );
}
type ControlPanelTypes = {
  pathname: string;
  view: ProfileViewType;
};

function ControlPanelRoutes({ pathname, view }: ControlPanelTypes) {
  const params = useParams();

  const { leagueData, hasPageAccess, sidebar } = useLeagueControlPanel();

  const baseRoute = ROUTES.CONTROL_PANEL + '/' + view + '/' + params['slug'];

  const navigationLinks = [
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.HOME,
      label: 'Home',
      icon: homeIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.HOME),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.MEMBERS,
      label: 'Members',
      icon: membersIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.MEMBERS),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.SEASONS,
      label: 'Seasons',
      icon: seasonsIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.SEASONS),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.TEAMS,
      label: 'Teams',
      icon: teamIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.TEAMS),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.PLAYERS,
      label: 'Players',
      icon: playerIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.PLAYERS),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.SCHEDULE,
      label: 'Schedule',
      icon: scheduleIcon,
      withSeasonParam: true,
      access: hasPageAccess(ControlPanelLeaguePages.SCHEDULE),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.REGISTRATIONS,
      label: 'Registrations',
      icon: registrationsIcon,
      withSeasonParam: true,
      access: hasPageAccess(ControlPanelLeaguePages.REGISTRATIONS),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.NEWS,
      label: 'News',
      icon: newsIcon,
      withSeasonParam: true,
      access: hasPageAccess(ControlPanelLeaguePages.NEWS),
    },
  ].filter((link) => link.access);

  return (
    <>
      {navigationLinks.map((link) => (
        <li
          key={link.label}
          className={classNames(
            pathname === link.href ? 'text-secondary' : '',
            'text-sm'
          )}
        >
          <Link
            href={
              link.withSeasonParam
                ? generateNavLinkWithParams(link.href, {
                    season: link.href.includes(
                      ROUTES.CONTROL_PANEL_SUBROUTES.SCHEDULE
                    )
                      ? leagueData.seasons.active_season_id
                      : undefined,
                    type: link.href.includes(
                      ROUTES.CONTROL_PANEL_SUBROUTES.SCHEDULE
                    )
                      ? 'game'
                      : undefined,
                  })
                : link.href
            }
            className={classNames(
              sidebar.isSidebarExpanded ? 'justify-start' : '',
              SIDEBAR_LINK_CLASSES
            )}
          >
            <span className=''>{link.icon}</span>{' '}
            {sidebar.isSidebarExpanded ? <span>{link.label}</span> : null}
          </Link>
        </li>
      ))}
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
    className='h-6 w-6'
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
    className='h-6 w-6'
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
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
    />
  </svg>
);

const seasonsIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
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
    className='h-6 w-6'
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
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
    />
  </svg>
);

const scheduleIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
    />
  </svg>
);

const registrationsIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
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
    className='h-6 w-6'
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
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z'
    />
  </svg>
);

const IconArrowRightSquare: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 16 16'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M15 2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2zM0 2a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm4.5 5.5a.5.5 0 000 1h5.793l-2.147 2.146a.5.5 0 00.708.708l3-3a.5.5 0 000-.708l-3-3a.5.5 0 10-.708.708L10.293 7.5H4.5z'
      />
    </svg>
  );
};

const IconArrowLeftSquare: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 16 16'
      height='1em'
      width='1em'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M15 2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2zM0 2a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm11.5 5.5a.5.5 0 010 1H5.707l2.147 2.146a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708l3-3a.5.5 0 11.708.708L5.707 7.5H11.5z'
      />
    </svg>
  );
};
