import { z } from 'zod';
import { format } from 'date-fns';
import classNames from 'classnames';
import { Dialog, Popover } from '@headlessui/react';
import { ErrorMessage, FastField, Form, Formik } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';

import Modal from '@/app/lib/components/Modal';
import ListBox from '@/app/lib/components/Listbox';
import { EventRecurrenceEnum } from '@/app/lib/enums/index';
import { eventFormSchema } from '@/app/lib/types/Resources/CreateEventResource';
import { Button } from '@/app/lib/components/Button';
import { Calendar } from '@/app/lib/components/Calendar';
import { ModalType } from '@/app/types';
import { GRAY_BOX_CLASSES } from '@/app/lib/globals/styles';

const customRecurrenceFormSaveTypesSchema = eventFormSchema.pick({
  recurrence_type: true,
  recurrence_interval: true,
  recurrence_end: true,
});

type CustomRecurrenceFormSaveTypes = z.infer<
  typeof customRecurrenceFormSaveTypesSchema
>;

type Props = {
  initialRecurrenceValues: CustomRecurrenceFormSaveTypes;
  onCompleteCustomRecurrenceForm: (
    values: CustomRecurrenceFormSaveTypes
  ) => void;
};

export default function CustomRecurrenceForm({
  isOpen,
  close,
  initialRecurrenceValues,
  onCompleteCustomRecurrenceForm,
}: Props & ModalType) {
  const recurrenctTypeOptions = [
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
  ];

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      panelClasses='sm:min-w-[475px] w-full overflow-visible w-max !text-sm'
    >
      <Dialog.Title className='mb-6 font-bold'>Custom recurrence</Dialog.Title>

      <Formik
        initialValues={initialRecurrenceValues}
        onSubmit={(values) => {
          onCompleteCustomRecurrenceForm(values);
          close();
        }}
        validate={toFormikValidate(customRecurrenceFormSaveTypesSchema)}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {(props) => (
          <Form className='space-y-6'>
            <div className='flex flex-col gap-y-1'>
              <div className='flex items-center gap-x-2'>
                <span className='w-[100px] font-medium text-zinc-600'>
                  Repeat every
                </span>{' '}
                <div className='flex items-center space-x-2'>
                  <FastField
                    className={classNames('!w-[100px]', GRAY_BOX_CLASSES)}
                    name='recurrence_interval'
                    type='number'
                    min={1}
                  />

                  <ListBox
                    rootClasses='!w-[175px] !min-w-max'
                    buttonClasses={GRAY_BOX_CLASSES}
                    options={recurrenctTypeOptions}
                    onChange={(value) => {
                      props.setFieldValue('recurrence_type', value);
                    }}
                    value={props.values.recurrence_type}
                    buttonText={
                      recurrenctTypeOptions.find(
                        (option) =>
                          option.value === props.values.recurrence_type
                      )?.label ?? 'please select'
                    }
                  />
                </div>{' '}
              </div>
              <ErrorMessage
                className='text-red-500'
                name='recurrence_interval'
                component='div'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <span className='w-[100px] font-medium text-zinc-600'>
                End on
              </span>
              <div className='flex items-center space-x-2'>
                <Popover
                  as='div'
                  className='relative flex h-full w-max items-center justify-center rounded-lg'
                >
                  <Popover.Button className={GRAY_BOX_CLASSES}>
                    {props.values.recurrence_end ? (
                      format(props.values.recurrence_end, 'PPP')
                    ) : (
                      <span>Pick a Date</span>
                    )}
                  </Popover.Button>

                  <Popover.Panel aria-label='Open Date'>
                    {({ close }) => (
                      <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                        <Calendar
                          defaultMonth={
                            props.values.recurrence_end
                              ? new Date(props.values.recurrence_end)
                              : new Date()
                          }
                          showOutsideDays={false}
                          mode='single'
                          selected={
                            props.values.recurrence_end
                              ? new Date(props.values.recurrence_end)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;

                            props.setFieldValue('recurrence_end', date);

                            close();
                          }}
                        />
                      </div>
                    )}
                  </Popover.Panel>
                </Popover>
              </div>
            </div>

            <div className='flex w-full justify-end gap-6'>
              <Button
                variant={'ghost'}
                type='button'
                className='!p-0'
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant={'ghost'}
                className='!p-0 text-primary'
              >
                Done
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
