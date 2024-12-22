'use client';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { IconBackupRestore, Spinner } from '@/app/lib/SVGs';
import MissingList from '@/app/control-panel/_components/MissingList';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useArchivedSeasons } from '@/app/lib/hooks/api/control-panel';

type Props = {
  restoreSeason: (seasonID: number) => void;
};

/**
 *
 * @param param0
 * @returns
 *
 * Season can only be deleted if no registrations, or games have been played
 */

export default function ArchivedSeasonsModal({
  isOpen,
  close,
  panelClasses,
  restoreSeason,
}: ModalType & Props) {
  const { slug } = useLeagueControlPanel();

  const { data, status } = useArchivedSeasons(slug);

  return (
    <Modal panelClasses={panelClasses} isOpen={isOpen} close={close}>
      <IconBackupRestore
        height={60}
        width={60}
        className='flex w-full items-center justify-center text-secondary'
      />

      <div className='mb-6 mt-3 flex flex-col items-center space-y-4'>
        <h1 className='text-lg font-bold'>Restore A Season</h1>

        <p className='text-center text-sm text-zinc-900'>
          Restoring a season will return it to the list of available seasons to
          activate & manage.
        </p>

        <div className='w-full space-y-2 rounded bg-slate-100 p-2'>
          {data && status === 'success' ? (
            <>
              {data.length > 0 ? (
                data.map((season) => {
                  return (
                    <div
                      key={season.id}
                      className='flex w-full items-center justify-between space-x-12 rounded bg-white p-2 text-sm font-medium'
                    >
                      {season.name}

                      <button
                        onClick={() => {
                          //TODO: connect to api
                          restoreSeason(season.id);
                        }}
                      >
                        <IconBackupRestore
                          height={22}
                          width={22}
                          className='cursor-pointer transition-colors duration-100 ease-out hover:text-secondary'
                        />
                      </button>
                    </div>
                  );
                })
              ) : (
                <MissingList
                  text='There are no achived seasons'
                  textClasses='text-base py-5'
                />
              )}
            </>
          ) : null}

          {status === 'loading' ? (
            <div className='flex h-full min-h-[200px] w-full items-center justify-center'>
              <Spinner width={50} height={50} />
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
