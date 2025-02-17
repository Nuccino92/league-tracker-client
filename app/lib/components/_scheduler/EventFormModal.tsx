import { useState } from 'react';

import { addYears, format, isSameDay } from 'date-fns';
import { Popover } from '@headlessui/react';
import {
  ErrorMessage,
  FastField,
  Field,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';

import Modal from '@/app/lib/components/Modal';
import ListBox from '@/app/lib/components/Listbox';
import { Calendar } from '@/app/lib/components/Calendar';
import generateTimeOptions, {
  findNearestTimeOption,
} from '@/app/lib/utils/generateTimeOptions';
import {
  GRAY_BOX_CLASSES,
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import {
  CreateEvent,
  createEventSchema,
  EventForm,
} from '@/app/lib/types/Resources/CreateEventResource';
import {
  IconCalendar,
  IconCategory,
  IconLocationOutline,
  IconTeamLine,
  IconTextLeft,
} from '@/app/lib/SVGs';
import { Button } from '@/app/lib/components/Button';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import { EventFormTypes } from '@/app/lib/types/Responses/events.types';
import generateEventTitles from '@/app/lib/utils/generateEventTitles';

import toUTCTimestamp from '@/app/lib/utils/toUTCTimestamp';
import { EventRecurrenceEnum, EventType } from '@/app/lib/enums/index';
import CustomRecurrenceForm from '@/app/lib/components/_scheduler/CustomRecurrenceForm';
import generateFormattedRecurrenceLabel from '@/app/lib/utils/generateFormattedRecurrenceLabel';
import { ModalType } from '@/app/types';
import { cn } from '@/app/lib/utils';

type Props = {
  eventFormData: EventForm;
  onSubmit: (saveValues: CreateEvent) => void;
  formType: EventFormTypes;
};

export default function EventFormModal({
  isOpen,
  close,
  eventFormData,
  onSubmit,
  formType,
  panelClasses,
}: Props & ModalType) {
  const [showCustomRecurrenceForm, setShowCustomRecurrenceForm] =
    useState(false);

  const eventOptions = [
    {
      label: 'Game',
      value: 'game',
    },
    {
      label: 'Practice',
      value: 'practice',
    },
    {
      label: 'Custom',
      value: 'custom_event',
    },
  ];

  const recurrenctTypeOptions = [
    {
      label: 'Does not repeat',
      value: EventRecurrenceEnum.NONE,
    },
    {
      label: 'Daily',
      value: EventRecurrenceEnum.DAILY,
    },
    {
      label: 'Weekly',
      value: EventRecurrenceEnum.WEEKLY,
    },
    {
      label: 'Monthly',
      value: EventRecurrenceEnum.MONTHLY,
    },
    {
      label: 'Custom...',
      value: 'custom',
    },
  ];

  return (
    <Modal
      panelClasses={cn(
        panelClasses,
        'sm:min-w-[640px] w-full overflow-visible w-max'
      )}
      isOpen={isOpen}
      close={close}
    >
      <Formik
        initialValues={
          {
            event_type: eventFormData.event_type,
            start_date: eventFormData.start_date,
            start_time:
              findNearestTimeOption(eventFormData.start_time, timeOptions)
                ?.value ?? '00:00',

            end_date: eventFormData.end_date,
            end_time: eventFormData.end_time
              ? findNearestTimeOption(eventFormData.end_time, timeOptions)
                  ?.value
              : null,

            location: eventFormData.location ? eventFormData.location : '',
            title: eventFormData.title,
            description: eventFormData.description
              ? eventFormData.location
              : '',
            notes: eventFormData.notes,
            teams: eventFormData.teams,
            lockedTeams: eventFormData.lockedTeams,
            recurrence_type: eventFormData.recurrence_type,
            recurrence_interval: eventFormData.recurrence_interval,
            recurrence_end: eventFormData.recurrence_end,
          } as EventForm
        }
        onSubmit={(values) => {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          const valuesToSave = {
            title: values.title,
            start: toUTCTimestamp(
              values.start_date,
              values.start_time,
              timezone
            ),
            end: toUTCTimestamp(values.end_date, values.end_time, timezone),
            event_type: values.event_type,
            location: values.location,
            description: values.description,
            notes: values.notes,
            teams: values.teams.map((team) => team.id),

            recurrence_type: values.recurrence_type,
            recurrence_interval: values.recurrence_interval,
            recurrence_end: values.recurrence_end
              ? toUTCTimestamp(values.recurrence_end, '23:59', timezone)
              : null,
          } as CreateEvent;

          onSubmit(valuesToSave);
        }}
        validate={async (values) => {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          const valuesToValidate = {
            title: values.title,
            start: toUTCTimestamp(
              values.start_date,
              values.start_time,
              timezone
            ),
            end: toUTCTimestamp(values.end_date, values.end_time, timezone),
            event_type: values.event_type as EventType,
            location: values.location,
            description: values.description,
            notes: values.notes,
            teams: values.teams.map((team) => team.id),

            recurrence_type: values.recurrence_type,
            recurrence_interval: values.recurrence_interval,
            recurrence_end: values.recurrence_end
              ? toUTCTimestamp(values.recurrence_end, '23:59', timezone)
              : null,
          };

          console.log('valuesToValidate', valuesToValidate);

          const validate = toFormikValidate(createEventSchema);

          return await validate(valuesToValidate);
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {(props) => (
          <>
            <Form className='space-y-4'>
              <div className='h-10'>
                <div className='text-lg font-bold'>Schedule An Event</div>
              </div>

              <div className='top-section space-y-4'>
                {/* Google calendar mimic */}
                <div className={INPUT_CONTAINER_CLASSES}>
                  <div className='flex items-center justify-start space-x-2'>
                    <IconCalendar
                      height={22}
                      width={22}
                      className='min-h-max min-w-max'
                    />
                    <div className='flex flex-row flex-wrap items-center gap-2'>
                      <div className='flex items-center space-x-2'>
                        <Popover
                          as='div'
                          className='relative flex h-full w-max items-center justify-center rounded-lg'
                        >
                          <Popover.Button className={GRAY_BOX_CLASSES}>
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

                                    const startTimeParts =
                                      props.values.start_time.split(':');
                                    const selectedDateTime = date
                                      ? new Date(date)
                                      : new Date();
                                    selectedDateTime.setHours(
                                      parseInt(startTimeParts[0], 10)
                                    );
                                    selectedDateTime.setMinutes(
                                      parseInt(startTimeParts[1], 10)
                                    );

                                    const endDateTime = new Date(
                                      selectedDateTime
                                    );
                                    endDateTime.setHours(
                                      endDateTime.getHours() + 1
                                    );

                                    props.setFieldValue(
                                      'end_date',
                                      endDateTime
                                    );
                                    props.setFieldValue(
                                      'end_time',
                                      endDateTime
                                        .toTimeString()
                                        .split(' ')[0]
                                        .substring(0, 5)
                                    );

                                    close();
                                  }}
                                />
                              </div>
                            )}
                          </Popover.Panel>
                        </Popover>

                        <ListBox
                          value={props.values.start_time}
                          rootClasses='!min-w-max'
                          buttonClasses={GRAY_BOX_CLASSES}
                          optionContainerClasses='max-h-[275px] swatches-picker '
                          optionClasees='text-sm'
                          onChange={(value) => {
                            if (!value || typeof value !== 'string') return;

                            props.setFieldValue('start_time', value);

                            const [hours, minutes] = value
                              .split(':')
                              .map(Number);

                            const startDateTime = new Date(
                              props.values.start_date
                            );
                            startDateTime.setHours(hours);
                            startDateTime.setMinutes(minutes);

                            const [endHours, endMinutes] = props.values.end_time
                              .split(':')
                              .map(Number);
                            const endDateTime = new Date(props.values.end_date);
                            endDateTime.setHours(endHours);
                            endDateTime.setMinutes(endMinutes);

                            if (startDateTime >= endDateTime) {
                              const newEndDateTime = new Date(startDateTime);
                              newEndDateTime.setHours(
                                newEndDateTime.getHours() + 1
                              );

                              props.setFieldValue('end_date', newEndDateTime);
                              props.setFieldValue(
                                'end_time',
                                newEndDateTime
                                  .toTimeString()
                                  .split(' ')[0]
                                  .substring(0, 5)
                              );
                            }
                          }}
                          buttonText={
                            timeOptions.find(
                              (option) =>
                                option.value === props.values.start_time
                            )?.label ?? 'Select Time'
                          }
                          options={timeOptions}
                          chevron={false}
                        />
                      </div>
                      <span className='text-sm'>to</span>
                      <div className='flex items-center space-x-2'>
                        <Popover
                          as='div'
                          className='relative flex h-full w-max items-center justify-center rounded-lg'
                        >
                          <Popover.Button className={GRAY_BOX_CLASSES}>
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

                                    const startDate = props.values.start_date;
                                    const startTime = props.values.start_time;

                                    props.setFieldValue('end_date', date);

                                    if (isSameDay(startDate, date)) {
                                      const [startHours, startMinutes] =
                                        startTime.split(':').map(Number);

                                      const startDateTime = new Date(startDate);
                                      startDateTime.setHours(startHours);
                                      startDateTime.setMinutes(startMinutes);

                                      let endDateTime: any;

                                      if (
                                        startHours === 23 &&
                                        startMinutes === 45
                                      ) {
                                        endDateTime = new Date(startDateTime);
                                      } else if (
                                        startHours === 23 &&
                                        startMinutes < 45
                                      ) {
                                        endDateTime = new Date(startDateTime);
                                        endDateTime.setMinutes(
                                          startMinutes + 15
                                        );
                                      } else if (startHours < 23) {
                                        endDateTime = new Date(startDateTime);
                                        endDateTime.setHours(startHours + 1);
                                      }

                                      props.setFieldValue(
                                        'end_time',
                                        endDateTime
                                          .toTimeString()
                                          .split(' ')[0]
                                          .substring(0, 5)
                                      );
                                    }

                                    close();
                                  }}
                                />
                              </div>
                            )}
                          </Popover.Panel>
                        </Popover>

                        <ListBox
                          rootClasses='!min-w-max'
                          optionContainerClasses='max-h-[275px] swatches-picker '
                          value={props.values.end_time}
                          buttonClasses={GRAY_BOX_CLASSES}
                          onChange={(value) =>
                            props.setFieldValue('end_time', value)
                          }
                          buttonText={
                            timeOptions.find(
                              (option) => option.value === props.values.end_time
                            )?.label ?? 'Select Time'
                          }
                          options={
                            isSameDay(
                              props.values.end_date,
                              props.values.start_date
                            )
                              ? timeOptions.filter(
                                  (time) => time.value > props.values.start_time
                                )
                              : timeOptions
                          }
                          chevron={false}
                        />
                      </div>
                      <ListBox
                        rootClasses='!w-[175px] !min-w-max'
                        buttonClasses={GRAY_BOX_CLASSES}
                        options={recurrenctTypeOptions}
                        onChange={(value) => {
                          if (value === 'custom') {
                            setShowCustomRecurrenceForm(true);
                          } else {
                            props.setFieldValue('recurrence_type', value);
                            props.setFieldValue('recurrence_interval', 1);
                            props.setFieldValue('recurrence_end', null);
                          }
                        }}
                        value={
                          props.values.recurrence_interval > 1
                            ? 'custom'
                            : props.values.recurrence_type
                        }
                        buttonText={generateFormattedRecurrenceLabel({
                          interval: props.values.recurrence_interval,
                          recurrenceType: props.values.recurrence_type,
                        })}
                      />
                    </div>{' '}
                  </div>
                </div>

                <div className={INPUT_CONTAINER_CLASSES}>
                  <div className='flex items-center space-x-2'>
                    {/* TODO: implement google places api */}
                    <IconLocationOutline height={22} width={22} />{' '}
                    <FastField
                      className={'!text-sm ' + INPUT_CLASSES}
                      name='location'
                      id='location'
                      placeholder='Add event location'
                    />
                  </div>
                </div>

                <div className={INPUT_CONTAINER_CLASSES}>
                  <div className='flex items-center space-x-2'>
                    <IconCategory height={22} width={22} strokeWidth={1.5} />{' '}
                    {eventOptions.map((option) => {
                      if (
                        formType === 'edit' &&
                        option.value !== props.values.event_type
                      )
                        return;
                      return (
                        <button
                          disabled={formType === 'edit' ? true : false}
                          key={option.value}
                          type='button'
                          className={cn(
                            props.values.event_type === option.value
                              ? '!bg-secondary/10 text-secondary hover:!bg-secondary/10'
                              : '!bg-white opacity-50',
                            '!border-0 ',
                            GRAY_BOX_CLASSES
                          )}
                          onClick={() => {
                            if (formType === 'edit') return;
                            props.setFieldValue(
                              'title',
                              generateEventTitles({
                                eventType: option.value as EventType,
                                teamNames: props.values.teams
                                  ? props.values.teams?.map((team) => team.name)
                                  : [],
                              })
                            );
                            props.setFieldValue('event_type', option.value);
                            props.setFieldError('title', undefined);
                            props.setFieldError('teams', undefined);
                          }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {props.values.event_type ? (
                <FormSectionBelowType props={props} formType={formType} />
              ) : null}

              <div className='flex w-full justify-end'>
                <Button
                  type='submit'
                  className={cn(
                    props.dirty ? 'animate-wiggle' : '',
                    'capitalize'
                  )}
                  variant={'secondary'}
                >
                  Save{' '}
                  {props.values.event_type === 'custom_event'
                    ? 'Custom Event'
                    : props.values.event_type}
                </Button>{' '}
              </div>
            </Form>

            {showCustomRecurrenceForm ? (
              <CustomRecurrenceForm
                isOpen={showCustomRecurrenceForm}
                close={() => setShowCustomRecurrenceForm(false)}
                onCompleteCustomRecurrenceForm={(values) => {
                  props.setFieldValue(
                    'recurrence_type',
                    values.recurrence_type
                  );
                  props.setFieldValue(
                    'recurrence_interval',
                    values.recurrence_interval
                  );
                  props.setFieldValue('recurrence_end', values.recurrence_end);
                }}
                initialRecurrenceValues={{
                  recurrence_type:
                    props.values.recurrence_type === 'none'
                      ? EventRecurrenceEnum.WEEKLY
                      : props.values.recurrence_type,
                  recurrence_interval: props.values.recurrence_interval,
                  recurrence_end: props.values.recurrence_end
                    ? props.values.recurrence_end
                    : addYears(new Date(), 1),
                }}
              />
            ) : null}
          </>
        )}
      </Formik>
    </Modal>
  );
}

function FormSectionBelowType({
  props,
  formType,
}: {
  props: FormikProps<EventForm>;
  formType: EventFormTypes;
}) {
  const { response, status } = useTeams({});

  return (
    <div className='bottom-section space-y-4'>
      <div className={'text-sm ' + INPUT_CONTAINER_CLASSES}>
        <div className='-mb-1 pl-7 text-xs font-medium'>Teams</div>
        <div className='flex items-center space-x-2'>
          <IconTeamLine height={20} width={20} strokeWidth={0.2} />

          <div className='flex items-center space-x-2'>
            {props.values.lockedTeams.length > 0 ? (
              <>
                {props.values.lockedTeams.map((team, index) => (
                  <div key={team.id} className='flex items-center space-x-2 '>
                    <ListBox
                      options={[]}
                      disabled
                      key={team.id + index}
                      value={team.id}
                      onChange={() => null}
                      buttonText={team.name}
                      chevron={false}
                      rootClasses='w-max min-w-max'
                      buttonClasses={cn(
                        'opacity-50 italic hover:',
                        GRAY_BOX_CLASSES
                      )}
                    />

                    {props.values.event_type === 'game' ? (
                      <span
                        className={cn(
                          formType === 'edit' ? 'opacity-50' : '',
                          '!ml-1 text-xs font-medium italic text-zinc-600'
                        )}
                      >
                        {index === 0 ? '(H)' : '(A)'}
                      </span>
                    ) : null}

                    {formType === 'add' &&
                    props.values.lockedTeams.length === 1 &&
                    props.values.event_type === 'game' ? (
                      <>
                        <ListBox
                          options={
                            response
                              ? [
                                  ...transformIntoOptions(response.data, {
                                    labelKey: 'name',
                                    valueKey: 'id',
                                  }),
                                ].filter(
                                  (dataTeam) =>
                                    Number(dataTeam.value) !==
                                    props.values.teams[0].id
                                )
                              : []
                          }
                          key={team.id + index}
                          value={team.id}
                          onChange={(value) => {
                            if (!response) return;
                            const newTeam = response.data.find(
                              (team) => team.id === Number(value)
                            );

                            if (!newTeam) return;

                            let newTeamArray = [...props.values.teams];

                            newTeamArray[1] = newTeam;

                            props.setFieldValue('teams', newTeamArray);
                            props.setFieldValue(
                              'title',
                              generateEventTitles({
                                eventType: 'game',
                                teamNames: newTeamArray.map(
                                  (team) => team.name
                                ),
                              })
                            );
                            props.setFieldError('teams', undefined);
                          }}
                          buttonText={
                            props.values.teams[1]
                              ? props.values.teams[1].name
                              : 'Select Team'
                          }
                          rootClasses='w-max min-w-max'
                          buttonClasses={cn(
                            props.errors.teams && !props.values.teams[1]
                              ? '!border-red-500 !text-red-500'
                              : '',
                            GRAY_BOX_CLASSES
                          )}
                        />

                        {props.values.event_type === 'game' ? (
                          <span className='!ml-1 text-xs font-medium italic text-zinc-600'>
                            (A)
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ))}
              </>
            ) : (
              <>
                <ListBox
                  options={
                    response
                      ? [
                          ...transformIntoOptions(response.data, {
                            labelKey: 'name',
                            valueKey: 'id',
                          }),
                        ]
                      : []
                  }
                  value={null}
                  //TODO: set field value of teams array to the first index being the value of the onchange
                  onChange={(value) => {
                    props.setFieldValue(
                      'teams',
                      props.values.teams
                        ? [...props.values.teams, value]
                        : [undefined, value]
                    );
                  }}
                  buttonText={'Select Team'}
                  rootClasses='w-max min-w-max'
                  buttonClasses='w-max italic border !bg-gray-100'
                />
                {props.values.event_type === 'game' ? (
                  <span
                    className={cn(
                      formType === 'edit' ? 'opacity-50' : '',
                      '!ml-1 text-xs font-medium italic text-zinc-600'
                    )}
                  >
                    (H)
                  </span>
                ) : null}
                {props.values.event_type === 'game' ? (
                  <>
                    <ListBox
                      options={
                        response
                          ? [
                              ...transformIntoOptions(response.data, {
                                labelKey: 'name',
                                valueKey: 'id',
                              }),
                            ]
                          : []
                      }
                      value={'teamTwoID'}
                      //TODO: set field value of teams array to the second index being the value of the onchange
                      onChange={() => null}
                      buttonText={'Select Team'}
                      rootClasses='w-max min-w-max'
                      buttonClasses='w-max italic border !bg-gray-100'
                    />

                    {props.values.event_type === 'game' ? (
                      <span
                        className={cn(
                          formType === 'edit' ? 'opacity-50' : '',
                          '!ml-1 text-xs font-medium italic text-zinc-600'
                        )}
                      >
                        (A)
                      </span>
                    ) : null}
                  </>
                ) : null}{' '}
              </>
            )}
            <ErrorMessage
              className='mx-1 text-sm text-red-500'
              name='teams'
              component='div'
            />
          </div>
        </div>
      </div>

      <div className={INPUT_CONTAINER_CLASSES}>
        <div className='flex items-center space-x-2'>
          <IconTextLeft height={22} width={22} />{' '}
          <div className='w-full space-y-2'>
            {/* Use of Field instead of FastField because we need to monitor event_type change */}
            <Field
              disabled={
                props.values.event_type === 'custom_event' ? false : true
              }
              className={cn(
                props.errors.title ? '!border-red-500' : '',
                '!py-2 !text-sm disabled:!text-zinc-400 ' + INPUT_CLASSES
              )}
              name='title'
              id='title'
              placeholder='Add event title'
            />

            <ErrorMessage
              className='mx-1 text-sm text-red-500'
              name='title'
              component='div'
            />
          </div>
        </div>
      </div>

      <div className={INPUT_CONTAINER_CLASSES}>
        <div className='flex items-start space-x-2'>
          <IconTextLeft height={22} width={22} className='mt-2' />{' '}
          <div className='w-full space-y-0.5'>
            <FastField
              className={cn(
                props.errors.description ? '!border-red-500' : '',
                'min-h-[110px] py-2 !text-sm ' + INPUT_CLASSES
              )}
              name='description'
              id='description'
              placeholder='Add event description (optional)'
              as='textarea'
            />

            <ErrorMessage
              className='mx-1 text-sm text-red-500'
              name='description'
              component='div'
            />
          </div>
        </div>
      </div>

      <div className={INPUT_CONTAINER_CLASSES}>
        <div className='flex items-start space-x-2'>
          <IconTextLeft height={22} width={22} className='mt-2' />{' '}
          <FastField
            className={'min-h-[80px] py-2 !text-sm ' + INPUT_CLASSES}
            name='notes'
            id='notes'
            placeholder='Add event notes (optional)'
            as='textarea'
          />
        </div>
      </div>
    </div>
  );
}

const timeOptions = generateTimeOptions();
