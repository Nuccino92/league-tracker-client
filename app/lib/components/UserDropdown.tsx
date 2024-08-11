'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import classNames from 'classnames';

import { useAuth, useCreateLeague } from '@/app/GlobalContext';
import { DownChevronIcon } from '@/app/lib/SVGs';
import ROUTES from '../globals/routes';
import logOut from '../utils/logOut';

type Props = {
  buttonClasses?: string;
  containerClasses?: string;
};

export default function UserDropdown({
  buttonClasses,
  containerClasses,
}: Props) {
  const { user } = useAuth();
  const { showCreateLeaugueModal, setShowCreateLeagueModal } =
    useCreateLeague();

  if (!user) return <div className='hidden' />;

  return (
    <Menu as={'div'} className={'relative'}>
      <Menu.Button
        id='user-menu-button'
        type='button'
        className={classNames(
          buttonClasses,
          'flex items-center space-x-2 rounded-md border bg-white p-2 text-sm font-medium text-primary'
        )}
      >
        <span className='w-[120px] truncate'>{user.name}</span>{' '}
        <DownChevronIcon height={22} width={22} />
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
        <Menu.Items
          className={classNames(
            containerClasses,
            'absolute  right-0 mt-2 w-full divide-y divide-gray-100 overflow-hidden rounded-md bg-white p-0 text-start text-sm font-medium shadow-lg'
          )}
        >
          <Menu.Item
            onClick={() => setShowCreateLeagueModal(true)}
            as={'button'}
            type='button'
            className={classNames(
              'flex items-center space-x-2',
              MENU_ITEM_CLASSES
            )}
          >
            <span>{startLeagueIcon}</span> <span>Start League</span>
          </Menu.Item>
          <Menu.Item
            as={'div'}
            className={classNames(
              'flex items-center space-x-2',
              MENU_ITEM_CLASSES
            )}
          >
            <span>{profileIcon}</span>
            <Link href={ROUTES.PROFILE}>View Profile</Link>
          </Menu.Item>

          <Menu.Item
            onClick={() => logOut(user.token)}
            as={'button'}
            type='button'
            className={classNames(
              'flex items-center space-x-2',
              MENU_ITEM_CLASSES
            )}
          >
            <span>{logoutIcon}</span> <span>Sign Out</span>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

const MENU_ITEM_CLASSES = `hover:bg-secondary hover:text-white w-full p-2 text-start`;

const startLeagueIcon = (
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

const profileIcon = (
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
      d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
    />
  </svg>
);

const logoutIcon = (
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
      d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
    />
  </svg>
);
