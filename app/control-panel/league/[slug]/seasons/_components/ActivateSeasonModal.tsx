'use client';

import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { inputClasses, inputContainerClasses } from '@/app/lib/globals/styles';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { IconBxCalendarStar } from '@/app/lib/SVGs';
import ListBox from '@/app/lib/components/Listbox';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';

type Props = {
  selectSeason: () => void;
};

export default function ActivateSeasonModal({
  isOpen,
  close,
  panelClasses,
  selectSeason,
}: ModalType & Props) {
  const { leagueData, activeSeason, hasSeasons } = useLeagueControlPanel();
  const { seasons: seasonInformation } = leagueData;

  if (activeSeason || !hasSeasons) {
    return <></>;
  }

  return (
    <Modal panelClasses={panelClasses} isOpen={isOpen} close={close}>
      <div className='flex w-full items-center justify-center text-secondary'>
        <IconBxCalendarStar height={60} width={60} />
      </div>

      <div className='mb-6 mt-3 flex flex-col items-center space-y-4'>
        <h1 className='text-lg font-bold'>Start A New Season</h1>

        <p className='text-center text-sm text-zinc-900'>
          Having an active season allows you to submit game scores. Create a new
          season or select from the dropdown to activate.
        </p>
      </div>

      <div className={classNames('', inputContainerClasses)}>
        {hasSeasons ? (
          <div className='flex items-center space-x-4 text-sm'>
            <ListBox
              value={activeSeason}
              onChange={selectSeason}
              buttonClasses={
                inputClasses + ' flex items-center justify-between'
              }
              buttonText={'Select from dropdown'}
              options={transformIntoOptions(seasonInformation.all_seasons, {
                labelKey: 'name',
                valueKey: 'id',
              })}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

//  Having an active season allows you to submit game scores.
// Create a season or select from the dropdown of your seasons to
// activate.
