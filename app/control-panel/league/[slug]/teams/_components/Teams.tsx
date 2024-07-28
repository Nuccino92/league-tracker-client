'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Menu, Transition, Listbox } from '@headlessui/react';
import classNames from 'classnames';

import Container from '@/app/control-panel/_components/Container';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import {
  IconEllipsisVertical,
  IconListAdd,
  DeleteIcon,
  EditIcon,
  IconOptionsOutline,
  IconBackupRestore,
  EmptyListIcon,
  DownChevronIcon,
  Spinner,
} from '@/app/lib/SVGs';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import SearchBar from '@/app/lib/components/SearchBar';
import { useRouter } from 'next/navigation';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import { ControlPanelListTeam } from '@/app/lib/types/Responses/control-panel.types';
import DeleteTeamModal from './DeleteTeamModal';
import AchivedTeamsModal from './ArchivedTeamsModal';
import MissingList from '@/app/control-panel/_components/MissingList';
import DropdownMenu from '@/app/lib/components/DropdownMenu';

const TeamForm = dynamic(
  () => import('@/app/control-panel/league/[slug]/teams/_components/TeamForm')
);
//import EditTeamForm from './_components/EditTeamForm';

const menuItemClasses = `hover:bg-secondary hover:text-white w-full p-2 text-start`;

//TODO: check if no active season and provide disclaimer telling user that they can only assign a team to an active season
export default function Teams({ slug }: { slug: string }) {
  const params = useParams();

  const { data: teams, status } = useTeams({
    slug,
    includeOnly: ['season', 'search'],
  });

  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showArchivedTeamsModal, setShowArchivedTeamsModal] = useState(false);

  const [page, setPage] = useState(
    params?.page ? parseInt(params?.page as string) : 1
  );

  return (
    <main className='h-full space-y-4'>
      <TeamsHeader
        setShowCreateTeamModal={setShowCreateTeamModal}
        setShowArchivedTeamsModal={setShowArchivedTeamsModal}
      />

      {status === 'success' && teams ? (
        <>
          <div className='h-full max-h-full'>
            <div className='swatches-picker h-[95%] max-h-[95%] space-y-6 overflow-y-auto'>
              {teams.length > 0 ? (
                teams.map((team) => <TeamCard team={team} key={team.id} />)
              ) : (
                <MissingList
                  text='There are no Teams'
                  icon={
                    <EmptyListIcon className='w-full' height={55} width={55} />
                  }
                />
              )}
            </div>
            <div className='w-full py-4 text-center'>paginate the teams</div>
          </div>

          {showCreateTeamModal ? (
            <TeamForm
              isOpen={showCreateTeamModal}
              close={() => setShowCreateTeamModal(false)}
            />
          ) : null}

          {showArchivedTeamsModal ? (
            <AchivedTeamsModal
              isOpen={showArchivedTeamsModal}
              close={() => setShowArchivedTeamsModal(false)}
            />
          ) : null}
        </>
      ) : null}

      {status === 'loading' ? (
        <div className='flex h-full w-full items-center justify-center py-12'>
          <Spinner width={50} height={50} />
        </div>
      ) : null}
    </main>
  );
}

// TODO: possibly make into a re usable component for other page

function TeamsHeader({
  setShowCreateTeamModal,
  setShowArchivedTeamsModal,
}: {
  setShowCreateTeamModal: Dispatch<SetStateAction<boolean>>;
  setShowArchivedTeamsModal: Dispatch<SetStateAction<boolean>>;
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

  const pageOptions = [
    {
      label: 'Create Team',
      action: () => setShowCreateTeamModal(true),
      icon: <IconListAdd height={20} width={20} />,
    },
    {
      label: 'Archived Teams',
      action: () => setShowArchivedTeamsModal(true),
      icon: <IconBackupRestore height={20} width={20} />,
    },
  ];

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <PageHeader text='League Teams' />

        <DropdownMenu
          items={pageOptions}
          itemClasses='p-2'
          buttonIcon={(open) => (
            <IconOptionsOutline
              height={24}
              width={24}
              color={open ? 'white' : 'currentColor'}
            />
          )}
        />
      </div>

      <div className='flex items-center space-x-6'>
        <span className='-mr-2 text-sm font-medium italic'>Filters:</span>
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
              )?.name ?? 'All Seasons'}
            </span>
            <DownChevronIcon height={22} width={22} />
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
                className={classNames(
                  selectedSeason === null ? 'bg-primary text-white' : '',
                  'cursor-pointer px-2 py-2 hover:bg-secondary hover:text-white'
                )}
              >
                All Seasons
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
                    <span>(current)</span>
                  ) : null}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
        <SearchBar
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          placeholder='Search for a team...'
          searchIconSize={22}
          closeIconSize={20}
        />
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: ControlPanelListTeam }) {
  const [showTeamEditModal, setShowTeamEditModal] = useState(false);
  const [showTeamDeleteModal, setShowTeamDeleteModal] = useState(false);

  const dropdownOption = [
    {
      label: 'Edit',
      action: () => setShowTeamEditModal(true),
      icon: <EditIcon width={20} height={20} />,
    },
    {
      label: 'Delete',
      action: () => setShowTeamDeleteModal(true),
      icon: <DeleteIcon width={20} height={20} />,
    },
  ];

  return (
    <>
      <div className='flex w-full items-center justify-between rounded bg-white p-4'>
        <div
          className='flex items-center space-x-2 transition-colors duration-100 ease-out hover:text-secondary'
          role='button'
          tabIndex={0}
          onClick={() => setShowTeamEditModal(true)}
        >
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

        <DropdownMenu
          items={dropdownOption}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${menuItemClasses}`}
        />
      </div>

      {showTeamEditModal ? (
        <TeamForm
          isOpen={showTeamEditModal}
          close={() => setShowTeamEditModal(false)}
          teamId={team.id}
        />
      ) : null}

      {showTeamDeleteModal ? (
        <DeleteTeamModal
          isOpen={showTeamDeleteModal}
          close={() => setShowTeamDeleteModal(false)}
          teamId={team.id}
        />
      ) : null}
    </>
  );
}
