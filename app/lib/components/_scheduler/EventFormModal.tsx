import { Dispatch, MutableRefObject, useState } from 'react';
import { FastField, Form, Formik } from 'formik';
import { format } from 'date-fns';

import { EventType } from '@/app/lib/types/Models/CalendarEvent';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import Modal from '../Modal';
import ListBox from '../Listbox';
import { Popover } from '@headlessui/react';
import { Calendar } from '../Calendar';
import generateTimeOptions, {
  roundToClosestTime,
} from '@/app/lib/utils/generateTimeOptions';
import { INPUT_CLASSES, INPUT_CONTAINER_CLASSES } from '../../globals/styles';
import { EventForm } from '../../types/Resources/CreateEventResource';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  eventFormData: EventForm;
  onCreate: () => void;
};

export default function EventFormModal({
  isOpen,
  onClose,
  eventFormData,
  onCreate,
}: Props) {
  return (
    <Modal
      panelClasses='sm:w-[690px] w-full overflow-visible'
      isOpen={isOpen}
      close={onClose}
    >
      <Formik
        //TODO: implement initial values to accept incoming even data
        initialValues={
          {
            event_type: eventFormData.event_type,
            start_date: eventFormData.start_date,
            start_time:
              roundToClosestTime(eventFormData.start_time, timeOptions)
                ?.value ?? '00:00',

            end_date: eventFormData.end_date,
            end_time: eventFormData.end_time
              ? roundToClosestTime(eventFormData.end_time, timeOptions)?.value
              : '00:00',

            location: eventFormData.location ? eventFormData.location : '',
            description: eventFormData.description
              ? eventFormData.location
              : '',
          } as EventForm
        }
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(props) => (
          <Form className='space-y-6'>
            <div className='text-lg font-bold'>Create an Event</div>

            <div className='top-section min-h-[200px] space-y-4'>
              {/* Google calendar mimic */}
              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  classes='text-sm'
                  label='Scheduled Date & Time'
                  htmlFor='date_and_time'
                  required
                />

                <div className='flex items-center justify-start space-x-2'>
                  <div className='flex items-center space-x-2'>
                    <Popover
                      as='div'
                      className='relative flex h-full w-max items-center justify-center rounded-lg'
                    >
                      <Popover.Button className='h-10 w-max rounded border bg-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-75 hover:bg-gray-200'>
                        {props.values.start_date ? (
                          format(props.values.start_date, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Popover.Button>

                      <Popover.Panel>
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

                    <ListBox
                      value={props.values.start_time}
                      rootClasses='!min-w-max'
                      buttonClasses='w-max !bg-gray-100 transition-colors duration-75 hover:!bg-gray-200 rounded border px-3 py-2 text-sm font-medium !shadow-none h-10'
                      optionContainerClasses='max-h-[275px] swatches-picker !w-[150px]'
                      optionClasees='text-sm'
                      onChange={(value) =>
                        props.setFieldValue('start_time', value)
                      }
                      buttonText={
                        timeOptions.find(
                          (option) => option.value === props.values.start_time
                        )?.label ?? 'All Roles'
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
                      <Popover.Button className='h-10 w-max rounded border bg-gray-100 px-3 py-2 text-sm font-medium transition-colors duration-75 hover:bg-gray-200'>
                        {props.values.end_date ? (
                          format(props.values.end_date, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Popover.Button>

                      <Popover.Panel>
                        {({ close }) => (
                          <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                            <Calendar
                              showOutsideDays={false}
                              mode='single'
                              selected={
                                props.values.end_date
                                  ? new Date(props.values.end_date)
                                  : undefined
                              }
                              onSelect={(date) => {
                                props.setFieldValue('end_date', date);
                                close();
                              }}
                            />
                          </div>
                        )}
                      </Popover.Panel>
                    </Popover>

                    <ListBox
                      value={props.values.end_time}
                      buttonClasses='w-max rounded !bg-gray-100 transition-colors duration-75 hover:!bg-gray-200 border px-3 py-2 text-sm font-medium !shadow-none h-10'
                      optionContainerClasses='max-h-[275px] swatches-picker !w-[150px]'
                      onChange={(value) =>
                        props.setFieldValue('end_time', value)
                      }
                      buttonText={
                        timeOptions.find(
                          (option) => option.value === props.values.end_time
                        )?.label ?? 'All Roles'
                      }
                      options={timeOptions}
                      chevron={false}
                    />
                  </div>{' '}
                </div>
              </div>

              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  classes='text-sm'
                  label='Event Location'
                  htmlFor='event_type'
                />

                {/* TODO: implement google places api */}
                <FastField
                  className={'!text-sm ' + INPUT_CLASSES}
                  name='location'
                  id='location'
                  placeholder='Add event location'
                />
              </div>

              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  classes='text-sm'
                  label='Event Type'
                  htmlFor='event_type'
                  required
                />

                <ListBox
                  value={props.values.event_type}
                  onChange={(value) => props.setFieldValue('event_type', value)}
                  optionContainerClasses='max-h-[275px] swatches-picker !w-[150px]'
                  buttonClasses='w-max rounded !bg-gray-100 transition-colors duration-75 hover:!bg-gray-200 border px-3 py-2 text-sm font-medium !shadow-none h-10'
                  buttonText={
                    eventOptions.find(
                      (event) => event.value === props.values.event_type
                    )?.label ?? 'Select a type'
                  }
                  options={eventOptions}
                  chevron={false}
                />
              </div>
            </div>

            {props.values.event_type ? <div>i am alive</div> : null}
          </Form>
        )}
      </Formik>

      <div></div>
    </Modal>
  );
}

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

const timeOptions = generateTimeOptions();

type Option = {
  label: string;
  value: string;
};
