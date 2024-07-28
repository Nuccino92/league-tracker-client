'use client';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { IconBackupRestore } from '@/app/lib/SVGs';
import MissingList from '@/app/control-panel/_components/MissingList';

type Props = {
  restoreSeason: (seasonID: number) => void;
};

export default function ArchivedSeasonsModal({
  isOpen,
  close,
  panelClasses,
  restoreSeason,
}: ModalType & Props) {
  // TODO: send request to get list of archived seasons to then render
  // TOOD: possibly return the archived season in the all_seasons array w/ flag
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
          {mockRestoreSeasonsData.length > 0 ? (
            mockRestoreSeasonsData.map((season, index) => {
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
        </div>
      </div>
    </Modal>
  );
}

const mockRestoreSeasonsData = [
  {
    id: 0,
    name: '2014 First season',
  },
  {
    id: 1,
    name: '2016-2017 Basketball season',
  },
  {
    id: 2,
    name: '2017-2018 Basketball season',
  },
  {
    id: 3,
    name: '2018-2019 Basketball season',
  },
  {
    id: 4,
    name: '2016-2017 Basketball season',
  },
  {
    id: 5,
    name: '2017-2018 Basketball season',
  },
  {
    id: 6,
    name: '2018-2019 Basketball season',
  },
];
