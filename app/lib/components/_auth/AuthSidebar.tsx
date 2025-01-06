'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

import ROUTES from '@/app/lib/globals/routes';
import { IconProfile, IconBell, IconMenu } from '@/app/lib/SVGs';
import { useAuthed } from '@/app/lib/components/_auth/AuthProvider';

export default function AuthSidebar() {
  const pathname = usePathname();

  const { isOpen, toggleSidebar } = useAuthed();

  const navItems = [
    { icon: <IconProfile />, label: 'Profile', href: ROUTES.PROFILE },
    { icon: <IconBell />, label: 'Notifications', href: ROUTES.NOTIFICATIONS },
  ];

  return (
    <div
      className={classNames(
        isOpen ? 'w-64' : 'w-16',
        'fixed left-0 top-0 flex h-screen flex-col border-r border-gray-200 bg-white'
      )}
    >
      <div
        className={classNames(
          isOpen ? 'justify-start' : 'justify-center',
          'flex h-[80px] items-center border-b border-gray-200 p-4'
        )}
      >
        <button
          onClick={() => toggleSidebar()}
          className='rounded-full p-2 hover:bg-gray-100'
        >
          <IconMenu height={26} width={26} />
        </button>
      </div>

      <nav className='flex-1 pt-4'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                isActive
                  ? 'bg-gray-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50',
                'mb-1 flex items-center px-4 py-3'
              )}
            >
              {item.icon}
              {isOpen && (
                <span className='ml-3 text-sm font-medium'>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
