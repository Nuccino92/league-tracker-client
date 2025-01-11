'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

import ROUTES from '@/app/lib/globals/routes';
import {
  IconProfile,
  IconMenu,
  InformationCircle,
  NotificationBell,
  RectangleGroup,
} from '@/app/lib/SVGs';
import { useAuthed } from '@/app/lib/components/_auth/AuthProvider';

export default function AuthSidebar() {
  const pathname = usePathname();
  const { sidebar } = useAuthed();

  const navItems = [
    {
      icon: <IconProfile height={24} width={24} strokeWidth={1.5} />,
      label: 'Profile',
      href: ROUTES.PROFILE,
    },
    {
      icon: <NotificationBell height={24} width={24} strokeWidth={1.5} />,
      label: 'Notifications',
      href: ROUTES.NOTIFICATIONS,
    },
    {
      icon: <RectangleGroup height={24} width={24} strokeWidth={1.5} />,
      label: 'Your Leagues',
      href: ROUTES.FOLLOWED_LEAGUES,
    },
    {
      icon: <InformationCircle height={24} width={24} strokeWidth={1.5} />,
      label: 'Help',
      href: ROUTES.HELP,
    },
  ];

  return (
    <div
      className={classNames(
        'fixed left-0 top-0 flex h-screen flex-col border-r border-gray-200 bg-white',
        sidebar.isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className='flex h-[80px] items-center border-b border-gray-200 px-2.5'>
        <button
          onClick={sidebar.toggleSidebar}
          className='rounded-full p-2 hover:bg-gray-100'
        >
          <IconMenu height={26} width={26} />
        </button>
      </div>

      <nav className='flex-1 space-y-1 pt-4'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                'group relative flex h-12 items-center px-[18px]',
                isActive
                  ? 'bg-gray-100 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <div
                className={classNames(
                  'flex items-center',
                  sidebar.isOpen ? '' : 'mx-auto'
                )}
              >
                {item.icon}
              </div>
              <span
                className={classNames(
                  'ml-3 text-sm font-medium',
                  sidebar.isOpen ? 'opacity-100' : 'opacity-0'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
