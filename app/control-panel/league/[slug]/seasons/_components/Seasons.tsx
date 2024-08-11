'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { INPUT_CLASSES } from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import {
  IconOptionsOutline,
  IconBxCalendarMinus,
  IconBxCalendarPlus,
  IconBxCalendarStar,
  IconBxCalendarExclamation,
  IconBackupRestore,
} from '@/app/lib/SVGs';
import CreateNewSeasonModal from './CreateNewSeasonModal';
import ConcludeSeasonModal from './ConcludeSeasonModal';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import StyledBox from '@/app/lib/components/StyledBox';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import ActivateSeasonModal from './ActivateSeasonModal';
import RemoveSeasonModal from './RemoveSeasonModal';
import ArchivedSeasonsModal from './ArchivedSeasonsModal';
import { Button } from '@/app/lib/components/Button';
import ListBox from '@/app/lib/components/Listbox';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';

export default function Seasons({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { leagueData, activeSeason, hasSeasons } = useLeagueControlPanel();
  const { seasons: seasonInformation } = leagueData;

  const [showConcludeSeasonModal, setShowConcludeSeasonModal] = useState(false);
  const [showCreateNewSeasonModal, setCreateNewSeasonModal] = useState(false);

  const [showSelectSeasonModal, setShowSelectSeasonModal] = useState(false);
  const [showRemoveSeasonModal, setRemoveSeasonModal] = useState(false);
  const [showArchivedSeasonsModal, setShowArchivedSeasonsModal] =
    useState(false);

  const seasonParam = searchParams.get('season');

  const focusedSeason = seasonParam
    ? seasonInformation.all_seasons.find(
        (season) => parseInt(seasonParam) === season.id
      ) || null
    : null;

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
        <StyledBox classes='p-4 md:w-[500px] space-y-4 mb-3'>
          {hasSeasons ? (
            <>
              <FormLabel label='Focused Season' htmlFor='' />
              <div className='flex items-center space-x-2 text-sm'>
                <ListBox
                  value={focusedSeason ? focusedSeason.id : null}
                  onChange={(val) => {
                    if (!val) return;
                    const params = new URLSearchParams();
                    params.set('season', val.toString());
                    const newUrl = `${pathname}?${params.toString()}`;
                    router.push(newUrl);
                  }}
                  buttonClasses={INPUT_CLASSES + ' !justify-center'}
                  buttonText={
                    focusedSeason
                      ? focusedSeason.name
                      : 'Select a season from the dropdown for management'
                  }
                  options={transformIntoOptions(seasonInformation.all_seasons, {
                    labelKey: 'name',
                    valueKey: 'id',
                  })}
                />
              </div>
            </>
          ) : (
            <div className='flex items-center justify-between space-x-2'>
              <span className='whitespace-nowrap font-bold text-zinc-600'>
                You don&apos;t have any seasons
              </span>

              <Button
                variant={'secondary'}
                onClick={() => setCreateNewSeasonModal(true)}
              >
                Create a season
              </Button>
            </div>
          )}
        </StyledBox>

        <div>
          <span className='italic text-zinc-600'>Active season:</span>{' '}
          <span className='font-bold'>
            &nbsp;
            {activeSeason ? activeSeason.name : 'No Active Season'}
          </span>
        </div>

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
