'use client';

import { useState } from 'react';
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
import {
  GameScheduleForm,
  TimeSlotSchemaType,
  timeSlotsSchema,
} from '@/app/lib/types/Resources/GenerateGameShedule';
import { IconClose, IconPlus, IconRemove } from '@/app/lib/SVGs';
import Checkbox from '@/app/lib/components/Checkbox';
import { Button } from '@/app/lib/components/Button';
import generateTimeOptions from '@/app/lib/utils/generateTimeOptions';
import ListBox from '@/app/lib/components/Listbox';

/**
 * days of week
 * index with null means all day
 * no key value at index means day no included
 */

type Props = {
  onSubmit: (formValues: any) => void;
};

type DayOfWeekModalType = {
  dayOfWeek: number;
  timeslots: TimeSlotSchemaType | null;
};

const timeOptions = generateTimeOptions();

export default function ScheduleGenerationForm({
  isOpen,
  close,
  onSubmit,
}: Props & ModalType) {
  const [dayOfWeekModalData, setDayOfWeekModalData] =
    useState<DayOfWeekModalType | null>(null);
  return (
    <>
      <Modal
        panelClasses='sm:min-w-[640px] max-w-[640px] w-full overflow-visible w-max'
        isOpen={isOpen}
        close={close}
      >
        <Dialog.Title className='mb-4 text-xl font-bold text-secondary'>
          Generate Season Schedule
        </Dialog.Title>
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

              days_of_week: {
                0: [{ start_time: '11:30', end_time: '21:30' }],
                1: [{ start_time: '17:00', end_time: '21:30' }],
                2: [{ start_time: '17:00', end_time: '21:30' }],
                3: [{ start_time: '17:00', end_time: '21:30' }],
                4: [{ start_time: '17:00', end_time: '21:30' }],
                5: [{ start_time: '17:00', end_time: '21:30' }],
                6: [{ start_time: '11:30', end_time: '21:30' }],
              },
            } as GameScheduleForm
          }
          onSubmit={(values) => {
            console.log('values', values);
          }}
          validate={async (values) => {
            // TOOD: parse createGameScheduleSchema
          }}
        >
          {(props) => (
            <Form className='space-y-4 text-sm'>
              {/* Date Range */}
              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
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
              <div
                className={classNames(INPUT_CONTAINER_CLASSES, '!space-y-1')}
              >
                <Popover
                  as='div'
                  className='relative flex h-full w-max items-center justify-center rounded-lg'
                >
                  <Popover.Button className='flex flex-row  items-center gap-2 font-bold text-primary transition-colors hover:text-primary/80'>
                    Choose dates to exclude
                  </Popover.Button>

                  <Popover.Panel aria-label='Open Date'>
                    {({ close }) => (
                      <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                        <Calendar
                          startMonth={props.values.start_date}
                          endMonth={props.values.end_date}
                          disabled={[
                            ...props.values.blackout_dates.map((date) => date),
                            {
                              before: props.values.start_date,
                              after: props.values.end_date,
                            },
                          ]}
                          showOutsideDays={false}
                          mode='single'
                          onSelect={(date) => {
                            if (!date) return;

                            const isDayAlreadySelected =
                              props.values.blackout_dates.some(
                                (blackout_date) =>
                                  isSameDay(blackout_date, date)
                              );

                            if (isDayAlreadySelected) return close();

                            props.setFieldValue(
                              'blackout_dates',
                              [...props.values.blackout_dates, date].sort(
                                (a, b) => a.getTime() - b.getTime()
                              )
                            );

                            close();
                          }}
                        />
                      </div>
                    )}
                  </Popover.Panel>
                </Popover>
                {props.values.blackout_dates.length > 0 ? (
                  <div className='gap-2 space-y-1'>
                    {props.values.blackout_dates.map((date, index) => {
                      return (
                        <div
                          key={index}
                          className='flex w-[185px] items-center justify-between gap-2 rounded border bg-gray-50 p-2 italic text-zinc-900'
                        >
                          <span>{format(date, 'MMMM dd, yyyy')}</span>{' '}
                          <button
                            className='transition-colors hover:text-red-500'
                            onClick={() =>
                              props.setFieldValue(
                                'blackout_dates',
                                props.values.blackout_dates
                                  .filter(
                                    (blackoutDate) =>
                                      !isSameDay(blackoutDate, date)
                                  )
                                  .sort((a, b) => a.getTime() - b.getTime())
                              )
                            }
                          >
                            <IconClose />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
                <FormLabel
                  label='Days & times of the week games will be scheduled'
                  htmlFor='start and end date'
                />

                <div className='flex items-center gap-2'>
                  {Object.entries({
                    0: 'S',
                    1: 'M',
                    2: 'T',
                    3: 'W',
                    4: 'T',
                    5: 'F',
                    6: 'S',
                  }).map(([key, value]) => {
                    const selected =
                      props.values.days_of_week[
                        key as unknown as keyof typeof props.values.days_of_week
                      ] !== undefined;

                    return (
                      <button
                        key={key}
                        type='button'
                        onClick={() => {
                          setDayOfWeekModalData({
                            dayOfWeek: parseInt(key),
                            timeslots: selected
                              ? (props.values.days_of_week[
                                  key as unknown as keyof typeof props.values.days_of_week
                                ] as any)
                              : undefined,
                          });
                        }}
                        className={classNames(
                          selected ? '!text-white' : '!text-white opacity-40',
                          'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold'
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}

                  <span className='text-xs text-zinc-600'>
                    {' '}
                    (click to adjust)
                  </span>
                </div>
              </div>

              {/* Games per team */}
              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
                <FormLabel
                  label='Number of games each team will play'
                  htmlFor='number_of_games_per_team'
                />
                <FastField
                  className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                  name='number_of_games_per_team'
                  type='number'
                  min={1}
                  max={50}
                />
              </div>
              {/* Balanced matchups */}
              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
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
              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
                <FormLabel
                  label='Maximum games allowed in one day'
                  htmlFor='games_per_day_limit'
                />
                <FastField
                  className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                  name='games_per_day_limit'
                  type='number'
                  min={1}
                  max={15}
                />
              </div>
              {/* Maximum games per day per team */}
              <div
                className={classNames('!space-y-1', INPUT_CONTAINER_CLASSES)}
              >
                <FormLabel
                  label='Maximum games allowed for a team in one day'
                  htmlFor='games_per_day_per_team_limit'
                />
                <FastField
                  className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                  name='games_per_day_per_team_limit'
                  type='number'
                  min={1}
                  max={5}
                />
              </div>
              <Button
                type='submit'
                className='animate-wiggle'
                variant={'secondary'}
              >
                Generate
              </Button>

              {dayOfWeekModalData ? (
                <DayOfWeekTimeSlotModal
                  isOpen={dayOfWeekModalData ? true : false}
                  close={() => setDayOfWeekModalData(null)}
                  {...dayOfWeekModalData}
                  onRemoveClick={(dayOfWeek) => {
                    let removed = { ...props.values.days_of_week };

                    delete removed[
                      dayOfWeek as unknown as keyof typeof props.values.days_of_week
                    ];

                    props.setFieldValue('days_of_week', removed);
                  }}
                  onUpdateClick={(dayOfWeek, timeslots) => {
                    let updated = { ...props.values.days_of_week };
                    updated[
                      dayOfWeek as unknown as keyof typeof props.values.days_of_week
                    ] = timeslots;

                    props.setFieldValue('days_of_week', updated);
                  }}
                />
              ) : null}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

function DayOfWeekTimeSlotModal({
  dayOfWeek,
  timeslots,
  isOpen,
  close,
  onRemoveClick,
  onUpdateClick,
}: ModalType &
  DayOfWeekModalType & {
    onRemoveClick: (dayOfWeek: number) => void;
    onUpdateClick: (
      dayOfWeek: number,
      timeslots: TimeSlotSchemaType | null | undefined
    ) => void;
  }) {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const [mutableTimeslots, setMutableTimeslots] = useState(timeslots);
  const [addNewTimeslotError, setAddNewTimeslotError] = useState<string | null>(
    null
  );

  const weekdayExcluded = mutableTimeslots === undefined ? true : false;
  const hasSelectedTimeslots = mutableTimeslots ? true : false;

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      panelClasses='sm:min-w-[440px] max-w-[440px] w-full overflow-visible w-max text-sm'
    >
      <Dialog.Title className='mb-4 text-xl font-bold text-secondary'>
        {weekDays[dayOfWeek]}
      </Dialog.Title>

      <Button
        type='button'
        onClick={() => {
          //Ensure start & end times are filled before adding another timeslot
          if (hasSelectedTimeslots) {
            const validation = timeSlotsSchema.safeParse(mutableTimeslots);

            if (!validation.success)
              return setAddNewTimeslotError(
                validation.error?.issues[0].message
              );
          }

          setMutableTimeslots((prev) => {
            if (!prev) return [{ start_time: '', end_time: '' }];

            return [...prev, { start_time: '', end_time: '' }];
          });
        }}
        variant={'ghost'}
        className='!p-0 font-medium text-secondary transition-colors hover:text-secondary/80'
      >
        <IconPlus height={14} width={14} />
        <span>Add Timeslot</span>
      </Button>

      <Dialog.Panel className='mt-2'>
        {!hasSelectedTimeslots ? (
          <div className='h-8 font-medium text-zinc-600'>
            {weekdayExcluded ? 'Weekday removed' : 'All Day'}
          </div>
        ) : (
          <div className='space-y-2'>
            {mutableTimeslots?.map((timeslot, index) => {
              return (
                <div
                  key={index}
                  className='flex items-center justify-between gap-2 rounded-md pr-4 text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <ListBox
                      disabled={index + 1 !== mutableTimeslots.length}
                      rootClasses='!min-w-[50px]'
                      optionContainerClasses='max-h-[275px] swatches-picker '
                      value={timeslot.start_time}
                      buttonClasses={classNames(
                        index + 1 === mutableTimeslots.length
                          ? '!bg-slate-100'
                          : '!bg-transparent hover:!text-primary',
                        timeslot.start_time !== 'text-secondary'
                          ? 'text-primary !text-sm hover:text-primary/80'
                          : '',
                        '!shadow-none w-max !bg-transparent'
                      )}
                      onChange={(value) => {
                        setMutableTimeslots((prev) => {
                          if (!prev) return prev;
                          const updatedTimeslots = [...prev];
                          updatedTimeslots[index] = {
                            ...updatedTimeslots[index],
                            start_time: value as string,
                          };
                          return updatedTimeslots;
                        });
                        setAddNewTimeslotError(null);
                      }}
                      buttonText={
                        timeOptions.find(
                          (option) => option.value === timeslot.start_time
                        )?.label ?? 'Start Time'
                      }
                      options={
                        index === 0
                          ? timeOptions
                          : timeOptions.filter(
                              (time) =>
                                time.value >
                                mutableTimeslots[index - 1].end_time
                            )
                      }
                      chevron={false}
                    />
                    <span className='px-4 text-zinc-600'>to</span>
                    <ListBox
                      disabled={index + 1 !== mutableTimeslots.length}
                      rootClasses='!min-w-[50px]'
                      optionContainerClasses='max-h-[275px] swatches-picker '
                      value={timeslot.end_time}
                      buttonClasses={classNames(
                        index + 1 === mutableTimeslots.length
                          ? '!bg-slate-100'
                          : '!bg-transparent hover:!text-primary',
                        timeslot.start_time !== 'text-secondary' &&
                          'text-primary !text-sm hover:text-primary/80',
                        '!shadow-none w-max'
                      )}
                      onChange={(value) => {
                        setMutableTimeslots((prev) => {
                          if (!prev) return prev;
                          const updatedTimeslots = [...prev];
                          updatedTimeslots[index] = {
                            ...updatedTimeslots[index],
                            end_time: value as string,
                          };
                          return updatedTimeslots;
                        });
                        setAddNewTimeslotError(null);
                      }}
                      buttonText={
                        timeOptions.find(
                          (option) => option.value === timeslot.end_time
                        )?.label ?? 'End Time'
                      }
                      options={
                        index === 0
                          ? timeOptions
                          : timeOptions.filter(
                              (time) =>
                                time.value > mutableTimeslots[index].start_time
                            )
                      }
                      chevron={false}
                    />{' '}
                  </div>

                  {index + 1 === mutableTimeslots.length && (
                    <button
                      type='button'
                      className='transition-colors hover:text-red-500'
                      onClick={() => {
                        setMutableTimeslots((prev) => {
                          if (!prev) return prev;
                          if (prev.length === 1) return null;
                          if (index + 1 !== mutableTimeslots.length)
                            return prev;
                          const removed = [...prev];
                          removed.splice(index, 1);

                          setAddNewTimeslotError(null);

                          return removed;
                        });
                      }}
                    >
                      <IconRemove height={18} width={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Dialog.Panel>

      {addNewTimeslotError && (
        <div className='mt-2 text-xs text-red-500'>{addNewTimeslotError}</div>
      )}

      <div className='flex w-full justify-end gap-4'>
        {!weekdayExcluded && mutableTimeslots !== undefined && (
          <Button
            className='!p-0 transition-colors hover:text-secondary'
            variant={'ghost'}
            type='button'
            onClick={() => {
              if (weekdayExcluded && mutableTimeslots === undefined) return;

              if (!mutableTimeslots) {
                close();
                return onUpdateClick(dayOfWeek, mutableTimeslots);
              }

              const validation = timeSlotsSchema.safeParse(mutableTimeslots);
              if (!validation.success)
                return setAddNewTimeslotError(
                  validation.error?.issues[0].message
                );

              close();
              onUpdateClick(dayOfWeek, mutableTimeslots);
            }}
          >
            Update
          </Button>
        )}

        {!weekdayExcluded && (
          <Button
            className='!p-0 transition-colors hover:text-secondary'
            type='button'
            variant={'ghost'}
            onClick={() => {
              onRemoveClick(dayOfWeek);
              close();
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </Modal>
  );
}
