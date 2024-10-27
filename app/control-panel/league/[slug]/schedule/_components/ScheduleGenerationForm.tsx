'use client';

import {
  ErrorMessage,
  FastField,
  Field,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import { addMonths, format, isSameDay } from 'date-fns';
import { Dialog, Popover } from '@headlessui/react';
import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import {
  GRAY_BOX_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import { Calendar } from '@/app/lib/components/Calendar';
import { GameScheduleForm } from '@/app/lib/types/Resources/GenerateGameShedule';
import { DownChevronIcon } from '@/app/lib/SVGs';
import Checkbox from '@/app/lib/components/Checkbox';

type Props = {
  //TODO: create type :)
  onSubmit: (formValues: any) => void;
};

export default function ScheduleGenerationForm({
  isOpen,
  close,
  onSubmit,
}: Props & ModalType) {
  /**
   * Form Values
   * - start & end date
   * - teams
   * - days of week
   * - games per team
   *
   */
  return (
    <Modal
      panelClasses='sm:min-w-[640px] w-full overflow-visible w-max'
      isOpen={isOpen}
      close={close}
    >
      <Dialog.Title className='mb-4 text-lg'>Settings</Dialog.Title>
      <Formik
        initialValues={
          {
            start_date: new Date(),
            end_date: addMonths(new Date(), 6),
            blackout_dates: [] as Array<Date>,
            number_of_games_per_team: 5,
            balanced_matchups: true,
            games_per_day_limit: 1,
            games_per_day_per_team_limit: 1,

            //figure out additional inputs
          } as GameScheduleForm
        }
        onSubmit={(values) => {
          console.log(values);
        }}
        validate={async (values) => {}}
      >
        {(props) => (
          //Use descriptive labels
          <Form className='space-y-4 text-sm'>
            {/* Date Range */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel
                label='The date range that games will be scheduled in'
                htmlFor='start and end date'
              />
              <div className='flex flex-row flex-wrap items-center gap-2'>
                <span className='text-sm font-medium'>From</span>
                <Popover
                  as='div'
                  className='relative flex h-full w-max items-center justify-center rounded-lg'
                >
                  <Popover.Button
                    className={classNames(
                      'flex flex-row items-center gap-2',
                      GRAY_BOX_CLASSES
                    )}
                  >
                    {props.values.start_date ? (
                      format(props.values.start_date, 'PPP')
                    ) : (
                      <span>Pick a Date</span>
                    )}
                    <DownChevronIcon height={20} width={20} strokeWidth={1} />
                  </Popover.Button>

                  <Popover.Panel aria-label='Open Date'>
                    {({ close }) => (
                      <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                        <Calendar
                          showOutsideDays={false}
                          mode='single'
                          selected={new Date(props.values.start_date)}
                          onSelect={(date) => {
                            props.setFieldValue('start_date', date);

                            close();
                          }}
                        />
                      </div>
                    )}
                  </Popover.Panel>
                </Popover>

                <span className='text-sm font-medium'>To</span>
                <div className='flex items-center space-x-2'>
                  <Popover
                    as='div'
                    className='relative flex h-full w-max items-center justify-center rounded-lg'
                  >
                    <Popover.Button
                      className={classNames(
                        'flex flex-row items-center gap-2',
                        GRAY_BOX_CLASSES
                      )}
                    >
                      {props.values.end_date ? (
                        format(props.values.end_date, 'PPP')
                      ) : (
                        <span>Pick a Date</span>
                      )}
                      <DownChevronIcon height={20} width={20} strokeWidth={1} />
                    </Popover.Button>

                    <Popover.Panel aria-label='Open Date'>
                      {({ close }) => (
                        <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                          <Calendar
                            showOutsideDays={false}
                            disabled={{ before: props.values.start_date }}
                            mode='single'
                            selected={
                              props.values.end_date
                                ? new Date(props.values.end_date)
                                : undefined
                            }
                            onSelect={(date) => {
                              if (!date) return;

                              props.setFieldValue('end_date', date);

                              close();
                            }}
                          />
                        </div>
                      )}
                    </Popover.Panel>
                  </Popover>
                </div>
              </div>{' '}
            </div>

            {/* Blacklist */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel label='Exclude these dates' htmlFor='blackout_dates' />
              <Popover
                as='div'
                className='relative flex h-full w-max items-center justify-center rounded-lg'
              >
                <Popover.Button
                  className={classNames(
                    'flex flex-row items-center gap-2',
                    GRAY_BOX_CLASSES
                  )}
                >
                  <span>Select a date</span>

                  <DownChevronIcon height={20} width={20} strokeWidth={1} />
                </Popover.Button>

                <Popover.Panel aria-label='Open Date'>
                  {({ close }) => (
                    <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                      <Calendar
                        startMonth={props.values.start_date}
                        endMonth={props.values.end_date}
                        disabled={{
                          before: props.values.start_date,
                          after: props.values.end_date,
                        }}
                        showOutsideDays={false}
                        mode='single'
                        onSelect={(date) => {
                          if (!date) return;

                          const isDayAlreadySelected =
                            props.values.blackout_dates.some((blackout_date) =>
                              isSameDay(blackout_date, date)
                            );

                          if (isDayAlreadySelected) return close();

                          props.setFieldValue('blackout_dates', [
                            ...props.values.blackout_dates,
                            date,
                          ]);

                          close();
                        }}
                      />
                    </div>
                  )}
                </Popover.Panel>
              </Popover>
              <div>
                {props.values.blackout_dates.map((date, index) => {
                  return (
                    <div key={index}>
                      <span>format me</span> <span>x close me</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Games per team */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel
                label='Number of games each team will play'
                htmlFor='number_of_games_per_team'
              />
              <FastField
                className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                name='number_of_games_per_team'
                type='number'
                min={1}
              />
            </div>

            {/* Balanced matchups */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel
                label='Each team will play eachother an even amount of times'
                htmlFor='balanced_matchups'
              />
              <Checkbox
                isChecked={props.values.balanced_matchups}
                onClick={() =>
                  props.setFieldValue(
                    'balanced_matchups',
                    !props.values.balanced_matchups
                  )
                }
              />
            </div>

            {/* Maximum games per day */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel
                label='Maximum games allowed on a day'
                htmlFor='games_per_day_limit'
              />
              <FastField
                className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                name='games_per_day_limit'
                type='number'
                min={1}
              />
            </div>

            {/* Maximum games per day per team */}
            <div className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}>
              <FormLabel
                label='Maximum games allowed on a day for a single team'
                htmlFor='games_per_day_per_team_limit'
              />
              <FastField
                className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                name='games_per_day_per_team_limit'
                type='number'
                min={1}
              />
            </div>
            <button>submit</button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
