'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Listbox, Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import {
  DeleteIcon,
  EditIcon,
  EmptyListIcon,
  IconAppstoreAdd,
  IconBackupRestore,
  IconEllipsisVertical,
  IconListAdd,
  IconOptionsOutline,
  downChevronIcon,
} from '@/app/lib/SVGs';
import SearchBar from '@/app/lib/components/SearchBar';
import { usePlayers } from '@/app/lib/hooks/api/control-panel/players';
import { ControlPanelPlayer } from '@/app/lib/types/Responses/control-panel.types';
import MissingList from '@/app/control-panel/_components/MissingList';

const menuItemClasses = `hover:bg-secondary hover:text-white w-full p-2 text-start`;

export default function Players({ slug }: { slug: string }) {
  const params = useParams();
  const { data, status } = usePlayers(slug);

  console.log('player data', data, status);

  const [showCreatePlayerModal, setShowCreatePlayerModal] = useState(false);
  const [page, setPage] = useState(
    params?.page ? parseInt(params?.page as string) : 1
  );

  return (
    <main className='space-y-4'>
      <PlayersHeader setShowCreatePlayerModal={setShowCreatePlayerModal} />

      {status === 'success' && data ? (
        <>
          <div className='space-y-6'>
            {data.length > 0 ? (
              data.map((player) => (
                <PlayerCard player={player} key={player.id} />
              ))
            ) : (
              <MissingList
                text='There are no Players'
                icon={
                  <EmptyListIcon className='w-full' height={55} width={55} />
                }
              />
            )}
          </div>
          <div>paginate the teams</div>
        </>
      ) : null}
    </main>
  );
}

function PlayersHeader({
  // setShowAddToSeasonModal,
  setShowCreatePlayerModal,
  //   setShowArchivedTeamsModal,
}: {
  //   setShowAddToSeasonModal: Dispatch<SetStateAction<boolean>>;
  setShowCreatePlayerModal: Dispatch<SetStateAction<boolean>>;
  //   setShowArchivedTeamsModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSeason = searchParams.get('season')
    ? parseInt(searchParams.get('season') as string)
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );
  const debouncedSearch = useDebounce(searchInputValue, 750);

  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  }, [createQueryString, debouncedSearch, pathname, router]);

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center space-x-6'>
        <Listbox
          as={'div'}
          className={'relative min-w-[200px]'}
          value={selectedSeason}
          onChange={(value) =>
            router.push(
              pathname + '?' + createQueryString('season', value?.toString())
            )
          }
        >
          <Listbox.Button
            type='button'
            className={
              'flex w-full items-center justify-between space-x-2 rounded bg-white p-2 text-sm font-medium shadow-sm'
            }
          >
            <span>
              {seasons.all_seasons.find(
                (season) => season.id === selectedSeason
              )?.name ?? 'All Teams'}
            </span>
            <span>{downChevronIcon}</span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options
              as='ul'
              className='absolute z-10 mt-1 w-max min-w-full overflow-auto rounded-md border border-violet-100 bg-white text-sm font-medium shadow-sm'
            >
              <Listbox.Option
                as='li'
                key={'all teams no season'}
                value={null}
                className=' cursor-pointer px-2 py-2 hover:bg-secondary hover:text-white'
              >
                All Teams
              </Listbox.Option>
              {seasons.all_seasons.map((season) => (
                <Listbox.Option
                  as='li'
                  key={season.id + season.name}
                  value={season.id}
                  className={classNames(
                    selectedSeason === season.id ? 'bg-primary text-white' : '',
                    'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white'
                  )}
                >
                  <span>{season.name}</span>{' '}
                  {season.id === seasons.active_season_id ? (
                    <span>(active)</span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>

      <div className='flex items-center space-x-6'>
        <SearchBar
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          placeholder='Search for a player...'
          searchIconSize={22}
          closeIconSize={20}
        />

        <Menu as={'div'} className={'relative'}>
          {({ open }) => (
            <>
              <Menu.Button
                type='button'
                className={classNames(
                  open ? 'bg-primary' : 'bg-white',
                  'fil-red-500 rounded border p-2 transition-colors duration-100 ease-out hover:border-primary hover:bg-primary hover:text-white'
                )}
              >
                <IconOptionsOutline
                  height={24}
                  width={24}
                  color={open ? 'white' : 'currentColor'}
                />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-100'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-100'
              >
                <Menu.Items
                  className={classNames(
                    'absolute right-0 z-10 mt-2 w-[225px] divide-y divide-gray-100 overflow-hidden rounded bg-white p-0 text-start text-sm font-medium shadow-lg'
                  )}
                >
                  <Menu.Item
                    as={'button'}
                    type='button'
                    onClick={() => setShowCreatePlayerModal(true)}
                    className={classNames(
                      'flex items-center space-x-2',
                      menuItemClasses
                    )}
                  >
                    <span>
                      <IconListAdd height={20} width={20} />
                    </span>
                    <span>Create Team</span>
                  </Menu.Item>
                  {/* <Menu.Item
                    as={'button'}
                    type='button'
                    onClick={() => setShowAddToSeasonModal(true)}
                    className={classNames(
                      'flex items-center space-x-2',
                      menuItemClasses
                    )}
                  >
                    <span>
                      <IconAppstoreAdd height={20} width={20} />
                    </span>
                    <span>Manage Active Season</span>
                  </Menu.Item> */}
                  {/* <Menu.Item
                    as={'button'}
                    type='button'
                    onClick={() => setShowArchivedTeamsModal(true)}
                    className={classNames(
                      'flex items-center space-x-2',
                      menuItemClasses
                    )}
                  >
                    <span>
                      <IconBackupRestore height={20} width={20} />
                    </span>
                    <span>Archived Teams</span>
                  </Menu.Item> */}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: ControlPanelPlayer }) {
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showPlayerDeleteModal, setShowPlayerDeleteModal] = useState(false);

  return (
    <>
      <div className='flex w-full items-center justify-between rounded bg-white p-4'>
        <div
          className='flex items-center space-x-2 transition-colors duration-100 ease-out hover:text-secondary'
          role='button'
          tabIndex={0}
          onClick={() => setShowPlayerEditModal(true)}
        >
          {player.avatar ? (
            <div className='relative h-12 w-12 rounded border'>
              <Image
                src={player.avatar}
                alt={`${player.avatar} logo`}
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
          <span className='font-medium'>{player.name}</span>
        </div>

        <Menu as={'div'} className={'relative'}>
          {({ open }) => (
            <>
              <Menu.Button
                type='button'
                className={classNames(
                  open ? 'border-primary bg-primary' : '',
                  'fil-red-500 rounded border border-violet-100 p-2 transition-colors duration-100 ease-out hover:border-primary hover:bg-primary hover:text-white'
                )}
              >
                <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-100'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-100'
              >
                <Menu.Items
                  className={classNames(
                    'absolute right-0 z-10 mt-2 w-[150px] divide-y divide-gray-100 overflow-hidden rounded border border-gray-100 bg-white p-0 text-start text-sm font-medium shadow-lg'
                  )}
                >
                  <Menu.Item
                    as={'button'}
                    type='button'
                    onClick={() => setShowPlayerEditModal(true)}
                    className={classNames(
                      'flex items-center space-x-2',
                      menuItemClasses
                    )}
                  >
                    <span>
                      <EditIcon width={20} height={20} />
                    </span>
                    <span>Edit</span>
                  </Menu.Item>
                  {/* this is a soft delete, i guess on the backend we will have an additional property */}
                  <Menu.Item
                    as={'button'}
                    type='button'
                    onClick={() => setShowPlayerDeleteModal(true)}
                    className={classNames(
                      'flex items-center space-x-2',
                      menuItemClasses
                    )}
                  >
                    <span>
                      <DeleteIcon width={20} height={20} />
                    </span>
                    <span>Delete</span>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>

      {/* {showPlayerEditModal ? (
        <PlayerForm
          isOpen={showTeamEditModal}
          close={() => setShowPlayerEditModal(false)}
          teamId={team.id}
        />
      ) : null} */}

      {/* {showPlayerDeleteModal ? (
        <DeletePlayerModal
          isOpen={showTeamDeleteModal}
          close={() => setShowPlayerDeleteModal(false)}
          teamId={team.id}
        />
      ) : null} */}
    </>
  );
}
