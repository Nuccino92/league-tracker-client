'use client';

import { useState } from 'react';

import {
  IconOptionsOutline,
  IconBxCalendarMinus,
  IconBxCalendarPlus,
  IconBxCalendarStar,
  IconBxCalendarExclamation,
  IconBackupRestore,
  IconPlus,
} from '@/app/lib/SVGs';
import CreateNewSeasonModal from './CreateNewSeasonModal';
import ConcludeSeasonModal from './ConcludeSeasonModal';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import ActivateSeasonModal from './ActivateSeasonModal';
import RemoveSeasonModal from './RemoveSeasonModal';
import ArchivedSeasonsModal from './ArchivedSeasonsModal';
import StyledBox from '@/app/lib/components/StyledBox';
import { Button } from '@/app/lib/components/Button';
export default function Seasons({ slug }: { slug: string }) {
  const { activeSeason, hasSeasons } = useLeagueControlPanel();

  const [showConcludeSeasonModal, setShowConcludeSeasonModal] = useState(false);
  const [showCreateNewSeasonModal, setCreateNewSeasonModal] = useState(false);

  const [showSelectSeasonModal, setShowSelectSeasonModal] = useState(false);
  const [showRemoveSeasonModal, setRemoveSeasonModal] = useState(false);
  const [showArchivedSeasonsModal, setShowArchivedSeasonsModal] =
    useState(false);

  const pageOptions = [
    ...(hasSeasons && !activeSeason
      ? [
          {
            label: 'Start Season',
            action: () => setShowSelectSeasonModal(true),
            icon: <IconBxCalendarStar height={20} width={20} />,
          },
        ]
      : []),
    {
      label: activeSeason ? 'Conclude Season' : 'Create Season',
      action: () =>
        activeSeason
          ? setShowConcludeSeasonModal(true)
          : setCreateNewSeasonModal(true),
      icon: activeSeason ? (
        <IconBxCalendarMinus height={20} width={20} />
      ) : (
        <IconBxCalendarPlus height={20} width={20} />
      ),
    },
    ...(hasSeasons
      ? [
          {
            label: 'Remove Season',
            action: () => setRemoveSeasonModal(true),
            icon: <IconBxCalendarExclamation height={20} width={20} />,
          },
        ]
      : []),
    {
      label: 'Archived Seasons',
      action: () => setShowArchivedSeasonsModal(true),
      icon: <IconBackupRestore height={20} width={20} />,
    },
  ];

  return (
    <main className='space-y-6'>
      <div className='flex items-center justify-between space-x-4'>
        <div className='flex items-center space-x-4'>
          <PageHeader text='Season Management' />

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
      </div>

      <div className='flex h-max w-full flex-col-reverse justify-between md:flex-row'>
        <StyledBox classes='w-full p-4 flex justify-end'>
          <Button
            onClick={() => setCreateNewSeasonModal(true)}
            className='flex !h-10 items-center justify-center gap-2'
          >
            <IconPlus /> <span>Create a new Season</span>
          </Button>
        </StyledBox>
        {showCreateNewSeasonModal ? (
          <CreateNewSeasonModal
            updateSeasons={(newSeason, shouldNewSeasonBeActive) => {
              setCreateNewSeasonModal(false);
            }}
            panelClasses='sm:w-[450px] w-full'
            isOpen={showCreateNewSeasonModal}
            close={() => setCreateNewSeasonModal(false)}
          />
        ) : null}
        {showConcludeSeasonModal ? (
          <ConcludeSeasonModal
            panelClasses='sm:w-[450px] w-full'
            isOpen={showConcludeSeasonModal}
            close={() => {
              // TODO: send api request to conclude season
              setShowConcludeSeasonModal(false);
            }}
          />
        ) : null}
        {showSelectSeasonModal ? (
          <ActivateSeasonModal
            isOpen={showSelectSeasonModal}
            panelClasses='sm:w-[450px] w-full overflow-visible'
            close={() => setShowSelectSeasonModal(false)}
            selectSeason={() => {
              setShowSelectSeasonModal(false);
            }}
          />
        ) : null}
        {showRemoveSeasonModal ? (
          <RemoveSeasonModal
            isOpen={showRemoveSeasonModal}
            panelClasses='sm:w-[450px] w-full'
            close={() => setRemoveSeasonModal(false)}
            removeSeason={() => {
              setRemoveSeasonModal(false);
            }}
          />
        ) : null}
        {showArchivedSeasonsModal ? (
          <ArchivedSeasonsModal
            isOpen={showArchivedSeasonsModal}
            panelClasses='sm:w-[450px] w-full'
            close={() => setShowArchivedSeasonsModal(false)}
            restoreSeason={() => {
              setShowArchivedSeasonsModal(false);
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
