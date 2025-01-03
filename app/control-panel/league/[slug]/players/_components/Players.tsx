'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import {
  DeleteIcon,
  EditIcon,
  EmptyListIcon,
  IconBackupRestore,
  IconEllipsisVertical,
  IconEye,
  IconListAdd,
  IconOptionsOutline,
  IconPersonCircle,
  Spinner,
} from '@/app/lib/SVGs';
import SearchBar from '@/app/lib/components/SearchBar';
import { usePlayers } from '@/app/lib/hooks/api/control-panel/players';
import { ControlPanelListPlayer } from '@/app/lib/types/Responses/control-panel.types';
import MissingList from '@/app/control-panel/_components/MissingList';
import { useControlPanelTeamsForDropdown } from '@/app/lib/hooks/api/control-panel/teams';
import AchivedPlayersModal from './ArchivedPlayersModal';
import DeletePlayerModal from './DeletePlayerModal';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import PlayerSummary from '@/app/control-panel/league/[slug]/players/_components/PlayerSummary';

const PlayerForm = dynamic(
  () =>
    import('@/app/control-panel/league/[slug]/players/_components/PlayerForm')
);

export default function Players({ slug }: { slug: string }) {
  const params = useParams();
  const { response, status, isLoading } = usePlayers({
    slug,
    includeOnly: ['page', 'search'],
  });

  const [showCreatePlayerModal, setShowCreatePlayerModal] = useState(false);
  const [showArchivedPlayersModal, setShowArchivedPlayersModal] =
    useState(false);

  const shouldDisplayContent = status === 'success' && response;

  return (
    <main className='h-full space-y-4'>
      <PlayersHeader
        setShowCreatePlayerModal={setShowCreatePlayerModal}
        setShowArchivedPlayersModal={setShowArchivedPlayersModal}
        slug={slug}
      />

      {shouldDisplayContent ? (
        <>
          <div className='h-full max-h-full'>
            <div className='swatches-picker h-[95%] max-h-[95%] space-y-3 overflow-y-auto'>
              {response.data.length > 0 ? (
                response.data.map((player) => (
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
            </div>{' '}
            <div className='w-full py-4 text-center'>paginate the teams</div>
          </div>

          {showCreatePlayerModal ? (
            <PlayerForm
              isOpen={showCreatePlayerModal}
              close={() => setShowCreatePlayerModal(false)}
            />
          ) : null}

          {showArchivedPlayersModal ? (
            <AchivedPlayersModal
              isOpen={showArchivedPlayersModal}
              close={() => setShowArchivedPlayersModal(false)}
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

function PlayersHeader({
  setShowCreatePlayerModal,
  setShowArchivedPlayersModal,
  slug,
}: {
  setShowCreatePlayerModal: Dispatch<SetStateAction<boolean>>;
  setShowArchivedPlayersModal: Dispatch<SetStateAction<boolean>>;
  slug: string;
}) {
  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { teamsDropdownList, status } = useControlPanelTeamsForDropdown({
    slug,
  });

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const selectedTeam = searchParams.get('team')
    ? parseInt(searchParams.get('team') as string)
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );
  const debouncedSearch = useDebounce(searchInputValue, 750);

  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  }, [createQueryString, debouncedSearch, pathname, router]);

  const hasFinishedFetching = status === 'success' && teamsDropdownList;

  const pageOptions = [
    {
      label: 'Create Player',
      action: () => setShowCreatePlayerModal(true),
      icon: <IconListAdd height={20} width={20} />,
    },
    {
      label: 'Archived Players',
      action: () => setShowArchivedPlayersModal(true),
      icon: <IconBackupRestore height={20} width={20} />,
    },
  ];

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <PageHeader text='Player Management' />
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
        <SearchBar
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          placeholder='Search for players...'
          searchIconSize={22}
          closeIconSize={20}
        />
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: ControlPanelListPlayer }) {
  const [showPlayerSummaryModal, setShowPlayerSummaryModal] = useState(false);
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showPlayerDeleteModal, setShowPlayerDeleteModal] = useState(false);

  const dropdownOption = [
    {
      label: 'View',
      action: () => setShowPlayerSummaryModal(true),
      icon: <IconEye width={20} height={20} />,
    },
    {
      label: 'Edit',
      action: () => setShowPlayerEditModal(true),
      icon: <EditIcon width={20} height={20} />,
    },
    {
      label: 'Delete',
      action: () => setShowPlayerDeleteModal(true),
      icon: <DeleteIcon width={20} height={20} />,
    },
  ];

  //TODO: add emails

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
            <div className='flex h-12 w-12 items-center justify-center rounded-md border bg-gray-500 font-medium text-white'>
              <IconPersonCircle
                height={30}
                width={30}
                color='rgb(209 213 219)'
              />
            </div>
          )}
          <div className='flex flex-col'>
            <span className='font-medium'>{player.name}</span>
            <span className='text-sm text-gray-500'>{player.email}</span>
          </div>
        </div>

        <DropdownMenu
          items={dropdownOption}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${MENU_ITEM_CLASSES}`}
        />
      </div>

      {showPlayerSummaryModal ? (
        <PlayerSummary
          isOpen={showPlayerSummaryModal}
          close={() => setShowPlayerSummaryModal(false)}
          playerId={player.id}
        />
      ) : null}

      {showPlayerEditModal ? (
        <PlayerForm
          isOpen={showPlayerEditModal}
          close={() => setShowPlayerEditModal(false)}
          playerId={player.id}
        />
      ) : null}

      {showPlayerDeleteModal ? (
        <DeletePlayerModal
          isOpen={showPlayerDeleteModal}
          close={() => setShowPlayerDeleteModal(false)}
          playerId={player.id}
        />
      ) : null}
    </>
  );
}
