'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';

import { ModalType } from '@/app/types';
import Modal from '@/app/lib/components/Modal';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { IconCheckSquare, Spinner } from '@/app/lib/SVGs';
import { Button } from '@/app/lib/components/Button';

// TODO: possible pass list of teams instead of handling them here
type Props = {
  onTeamSelection: (teamsIds: number[]) => void;
};

/**
 *
 * @param param0
 * @returns
 *
 * @TODO
 *  - need to return only the teams that are part of the selected season
 *  - allow user to select any number of teams that they would like, when they click the apply button then put the teams in the params (teams) for the useEvents hook to read and pass to api
 *  - if the user has all the teams selected when clicking the apply button, then erase the param (teams)
 */

export default function TeamSelectionModal({
  isOpen,
  close,
  panelClasses,
  onTeamSelection,
}: Props & ModalType) {
  const { data: teams, status } = useTeams({
    paginate: false,
    includeOnly: ['season'],
  });

  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  function handleTeamSelection(teamId: number) {
    if (selectedTeams)
      setSelectedTeams((prev: number[]) => {
        return prev.includes(teamId)
          ? prev.filter((id) => id !== teamId)
          : selectedTeams.length + 1 === teams?.length
            ? []
            : [...prev, teamId];
      });
  }

  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:max-w-[540px] sm:min-w-[540px]  w-full overflow-visible flex justify-start flex-col items-start'
      )}
      isOpen={isOpen}
      close={close}
    >
      <Dialog.Title className='mb-6 h-full text-xl font-medium'>
        Choose the teams
      </Dialog.Title>

      {teams && status === 'success' ? (
        <div className='flex w-full flex-col gap-y-6'>
          <div className='swatches-picker flex max-h-[400px] w-full flex-col gap-2 overflow-y-auto rounded-md bg-slate-100 p-2'>
            {teams.length > 0 ? (
              teams.map((team) => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <button
                    onClick={() => handleTeamSelection(team.id)}
                    key={team.id}
                    type='button'
                    aria-label='Team Selection'
                    className={classNames(
                      isSelected
                        ? 'border-secondary'
                        : 'border-primary font-medium text-primary',
                      'relative flex w-full items-center justify-center rounded-lg border bg-white p-3 px-7 text-sm font-medium hover:!border-secondary hover:ring-2 hover:ring-secondary'
                    )}
                  >
                    {team.logo ? (
                      <Image
                        src={team.logo}
                        alt={`${team.name} logo`}
                        width={34}
                        height={34}
                        className='mr-2'
                      />
                    ) : null}

                    <span>{team.name}</span>

                    {isSelected ? (
                      <span className='absolute right-0 px-2 text-secondary'>
                        <IconCheckSquare height={18} width={18} />
                      </span>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className='text-sm'>
                There are not teams added to this season.
              </div>
            )}
          </div>
          {teams.length > 0 ? (
            <Button
              variant={'secondary'}
              disabled={selectedTeams.length === 0}
              type='button'
              className='self-end'
              onClick={() => {
                onTeamSelection(selectedTeams);
                close();
              }}
            >
              Select
            </Button>
          ) : null}
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className='flex h-full w-full items-center justify-center py-10'>
          <Spinner height={40} width={40} />
        </div>
      ) : null}

      {status === 'error' ? <div>something went wrong</div> : null}
    </Modal>
  );
}
