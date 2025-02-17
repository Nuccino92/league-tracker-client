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
import { HeroChevronRight } from '@/app/lib/SVGs';

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
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.DASHBOARD,
      label: 'Dashboard',
      icon: dashboardIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.DASHBOARD),
    },
    {
      href:
        baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.MEMBERS + `?search=&page=1`,
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
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.NOTICES,
      label: 'Notices',
      icon: newsIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.NOTICES),
    },
    {
      href: baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.SETTINGS,
      label: 'Settings',
      icon: settingsIcon,
      withSeasonParam: false,
      access: hasPageAccess(ControlPanelLeaguePages.SETTINGS),
    },
  ].filter((link) => link.access);

  return (
    <>
      {navigationLinks.map((link, index) => (
        <li
          key={link.label}
          className={classNames(
            pathname === link.href ? 'text-secondary' : '',
            link.href === baseRoute + ROUTES.CONTROL_PANEL_SUBROUTES.SETTINGS &&
              'border-t pt-2',
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
              sidebar.isSidebarExpanded ? 'justify-between' : '',
              SIDEBAR_LINK_CLASSES
            )}
          >
            <div className='flex items-center gap-x-3'>
              <span className=''>{link.icon}</span>{' '}
              {sidebar.isSidebarExpanded ? <span>{link.label}</span> : null}
            </div>

            <HeroChevronRight height={12} width={12} />
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
//           <span>{dashboardIcon}</span> {isSidebarExpanded ? <span>Home</span> : null}
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

const dashboardIcon = (
  <svg fill='currentColor' viewBox='0 0 1024 1024' className='h-6 w-6'>
    <path d='M924.8 385.6a446.7 446.7 0 0 0-96-142.4 446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96 446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2 55.95 55.95 0 0 0 79.2 0 55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z' />
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
      d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
    />
  </svg>
);

const settingsIcon = (
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
      d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
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
