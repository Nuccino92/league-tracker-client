'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import { IconEllipsisVertical, deleteIcon } from '@/app/lib/SVGs';

export default function TeamsPage() {
  // TODO: fetch teams
  // could reference my league hook to get the active season
  return (
    <Container view='league'>
      <PageHeader text='Teams' />
      <main>
        <div>possible season selector</div>
        <div className='space-y-6'>
          {mockTeamList.map((team) => (
            <TeamCard team={team} key={team.id} />
          ))}
        </div>
        <div>paginate the teams</div>
      </main>
    </Container>
  );
}

// TODO: update to grab from model
type TeamCardProps = {
  team: {
    id: number;
    name: string;
    logo: string | null;
    league_id: number;
  };
};

function TeamCard({ team }: TeamCardProps) {
  return (
    <div className='flex w-full items-center justify-between rounded bg-white px-2 py-4'>
      <div className='flex items-center space-x-2'>
        {team.logo ? (
          <div className='relative h-12 w-12 rounded border'>
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              fill
              style={{ objectFit: 'contain', position: 'absolute' }}
              sizes='(max-width: 50px) 100vw'
            />
          </div>
        ) : (
          <div className='flex h-12 w-12 items-center justify-center rounded border bg-primary text-sm font-medium text-white'>
            N/A
          </div>
        )}
        <span className='font-medium'>{team.name}</span>
      </div>

      <Menu as={'div'} className={'relative'}>
        <Menu.Button
          type='button'
          className={'rounded border border-violet-100 p-2'}
        >
          <IconEllipsisVertical />
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
              'absolute right-0 z-10 mt-2 w-[150px] divide-y divide-gray-100 overflow-hidden rounded bg-white p-0 text-start text-sm font-medium shadow-lg'
            )}
          >
            <Menu.Item
              as={'button'}
              type='button'
              className={classNames(
                'flex items-center space-x-2',
                menuItemClasses
              )}
            >
              <span>{deleteIcon}</span>
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item
              as={'button'}
              type='button'
              className={classNames(
                'flex items-center space-x-2',
                menuItemClasses
              )}
            >
              <span>{deleteIcon}</span>
              <span>Delete</span>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

const mockTeamList = [
  {
    id: 1,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
  {
    id: 2,
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    league_id: 20,
  },
  {
    id: 3,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
  {
    id: 4,
    name: 'Toronto Raptors',
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    league_id: 20,
  },
  {
    id: 5,
    name: 'Toronto Raptors',
    logo: null,
    league_id: 20,
  },
];

const menuItemClasses = `hover:bg-secondary hover:text-white w-full p-2 text-start`;
