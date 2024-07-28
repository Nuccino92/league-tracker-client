'use client';

import { Fragment } from 'react';
import classNames from 'classnames';
import { Listbox, Transition } from '@headlessui/react';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { inputClasses, inputContainerClasses } from '@/app/lib/globals/styles';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { DownChevronIcon, IconBxCalendarStar } from '@/app/lib/SVGs';

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

  if (activeSeason || hasSeasons) {
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
            {/* TODO: */}
            <Listbox value={activeSeason} onChange={selectSeason}>
              <div className='relative w-full'>
                <Listbox.Button
                  id='listbox-button-id'
                  type='button'
                  className={classNames(
                    inputClasses,
                    'flex items-center justify-between'
                  )}
                >
                  <span>Select from dropdown</span>
                  <DownChevronIcon height={22} width={22} />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute z-10 mt-1 w-full overflow-auto rounded-md border border-violet-100 bg-white shadow'>
                    {seasonInformation.all_seasons.map((season) => (
                      <Listbox.Option
                        onClick={(e) => {
                          if (seasonInformation.active_season_id) {
                            e.preventDefault();
                            return e.stopPropagation();
                          } else {
                            try {
                              // TODO: add api call/mutation to set this as the active season
                              // TODO: give prompt telling them that this will activate this older season
                            } catch (error) {
                              console.log(error);
                            }
                          }
                        }}
                        className={classNames(
                          seasonInformation.active_season_id
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer',
                          ' px-2 py-2 hover:bg-secondary hover:text-white'
                        )}
                        key={season.id}
                        value={season.id}
                      >
                        {season.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

//  Having an active season allows you to submit game scores.
// Create a season or select from the dropdown of your seasons to
// activate.
