'use client';

import { useState } from 'react';
import { z } from 'zod';

import Checkbox from '@/app/lib/components/Checkbox';
import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { INPUT_CLASSES } from '@/app/lib/globals/styles';
import { IconBxCalendarPlus } from '@/app/lib/SVGs';
import { Season } from '@/app/lib/types/Models/Season';

const newSeasonNameSchema = z
  .string()
  .min(5, { message: 'Season name must be at least 5 characters' })
  .max(50, { message: 'Season name must not exceed 50 characters' });

type Props = {
  updateSeasons: (
    newSeasonData: Season,
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

      const fakeSeasonInformationResponse = { id: 11, name: 'Bougahtti' };

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
        <IconBxCalendarPlus height={60} width={60} fill='#03C988' />
        <h1 className='text-lg font-bold'>Create a new season</h1>

        <div className='w-full space-y-2'>
          <input
            value={newSeasonName}
            onChange={(e) => {
              if (nameError) setNameError(null);
              setNewSeasonName(e.target.value);
            }}
            placeholder='Enter the name here'
            className={INPUT_CLASSES}
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
