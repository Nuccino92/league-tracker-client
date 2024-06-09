'use client';

import { JSX, SVGProps, useState } from 'react';
import { z } from 'zod';

import Checkbox from '@/app/lib/components/Checkbox';
import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { SeasonType } from '@/app/lib/types/Season/Season';
import { inputClasses } from '@/app/lib/globals/styles';

const newSeasonNameSchema = z
  .string()
  .min(5, { message: 'Season name must be at least 5 characters' })
  .max(50, { message: 'Season name must not exceed 50 characters' });

type Props = {
  updateSeasons: (
    newSeasonData: SeasonType,
    shouldNewSeasonBeActive: boolean
  ) => void;
};

export default function CreateNewSeasonModal({
  panelClasses,
  isOpen,
  close,
  updateSeasons,
}: ModalType & Props) {
  const [newSeasonName, setNewSeasonName] = useState('');
  const [shouldActivateSeason, setShouldActivateSeason] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleCreateSeason = () => {
    try {
      newSeasonNameSchema.parse(newSeasonName);
      setNameError(null);

      const seasonValue = {
        name: newSeasonName,
        activate: shouldActivateSeason,
      };

      // TODO: save to api w/ seasonValue
      // TODO: should check if name already exists in backend, if so setNameError

      const fakeSeasonInformationResponse = { id: '69', name: 'Bougahtti' };

      updateSeasons(fakeSeasonInformationResponse, shouldActivateSeason);
      setNewSeasonName('');
      setShouldActivateSeason(false);
      setNameError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setNameError(error.errors[0].message);
      }
    }
  };

  return (
    <Modal panelClasses={panelClasses} isOpen={isOpen} close={close}>
      <div className='flex flex-col items-center space-y-4'>
        <IconCalendarCheck height={34} width={34} fill='#03C988' />
        <h1 className='text-lg font-bold'>Create a new season</h1>

        <div className='w-full space-y-2'>
          <input
            value={newSeasonName}
            onChange={(e) => {
              if (nameError) setNameError(null);
              setNewSeasonName(e.target.value);
            }}
            placeholder='Enter the name here'
            className={inputClasses}
          />
          {nameError && (
            <p className='w-full text-start text-sm text-red-500'>
              {nameError}
            </p>
          )}
        </div>

        <div className='!mt-6 flex w-full items-center justify-between'>
          <div className='flex items-center space-x-2 text-sm'>
            <Checkbox
              classes=''
              isChecked={shouldActivateSeason}
              onClick={() => setShouldActivateSeason((prev) => !prev)}
            />
            <label htmlFor='shouldActivateSeason'>
              Activate season when created?
            </label>{' '}
          </div>{' '}
          <button
            onClick={handleCreateSeason}
            type='button'
            className='rounded border bg-secondary p-2 text-sm font-medium text-white'
          >
            Create season
          </button>
        </div>
      </div>
    </Modal>
  );
}

function IconCalendarCheck(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 16 16'
      height='1em'
      width='1em'
      {...props}
    >
      <path d='M10.854 7.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L7.5 9.793l2.646-2.647a.5.5 0 01.708 0z' />
      <path d='M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z' />
    </svg>
  );
}
