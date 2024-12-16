'use client';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { DeleteIcon, IconBxCalendarExclamation } from '@/app/lib/SVGs';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

type Props = {
  removeSeason: (seasonID: number) => void;
};

export default function RemoveSeasonModal({
  isOpen,
  close,
  panelClasses,
  removeSeason,
}: ModalType & Props) {
  const { leagueData, activeSeason } = useLeagueControlPanel();
  const { seasons } = leagueData;

  return (
    <Modal panelClasses={panelClasses} isOpen={isOpen} close={close}>
      <IconBxCalendarExclamation
        height={60}
        width={60}
        className='flex w-full items-center justify-center text-red-600'
      />

      <div className='mb-6 mt-3 flex flex-col items-center space-y-4'>
        <h1 className='text-lg font-bold'>Remove A Season</h1>

        <p className='text-center text-sm text-zinc-900'>
          Deleting a season will archive or permanently remove it depending on
          if any games have been played. To restore a removed season click the
          &quot;Archived Seasons&quot; option from the dropdown.
        </p>

        <div className='w-full space-y-2 rounded bg-slate-100 p-2'>
          {seasons.all_seasons.map((season, index) => {
            return (
              <div
                key={season.id}
                className='flex w-full items-center justify-between space-x-12 rounded bg-white p-2 text-sm font-medium'
              >
                <div>
                  {activeSeason && activeSeason.id === season.id ? (
                    <span className='mr-2 italic text-zinc-400'>(active)</span>
                  ) : null}
                  <span>{season.name}</span>
                </div>{' '}
                <button
                  onClick={() => {
                    //TODO: connect to api
                    removeSeason(season.id);
                  }}
                >
                  <DeleteIcon
                    height={22}
                    width={22}
                    className='cursor-pointer transition-colors duration-100 ease-out hover:text-red-600'
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
