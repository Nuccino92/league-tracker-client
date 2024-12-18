import { Field, Form, Formik, ErrorMessage, FieldProps } from 'formik';
import { Popover } from '@headlessui/react';
import classNames from 'classnames';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import 'react-day-picker/dist/style.css';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import {
  createRegistrationFormSchema,
  CreateRegistrationFormValues,
} from '@/app/lib/types/Responses/control-panel.types';
import { Calendar } from '@/app/lib/components/Calendar';
import { format } from 'date-fns';
import { GRAY_BOX_CLASSES, INPUT_CLASSES } from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import ListBox from '@/app/lib/components/Listbox';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import { Button } from '@/app/lib/components/Button';
import { useCreateRegistrationForm } from '@/app/lib/hooks/api/control-panel/registrations';
import { Spinner } from '@/app/lib/SVGs';

type Props = {
  slug: string;
};

export default function CreateRegistrationFormModal({
  isOpen,
  close,
  panelClasses,
  slug,
}: Props & ModalType) {
  const { leagueData } = useLeagueControlPanel();

  const initialValues: CreateRegistrationFormValues = {
    seasonId: '',
    price: 0,
    openDate: null,
    closeDate: null,
  };

  const seasonOptions = transformIntoOptions(leagueData.seasons.all_seasons, {
    labelKey: 'name',
    valueKey: 'id',
  });

  const createRegistrationFormMutation = useCreateRegistrationForm({ slug });

  async function handleSubmit(values: any) {
    await createRegistrationFormMutation.mutateAsync(values);

    close();
  }

  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:min-w-[640px] w-full overflow-visible w-max relative'
      )}
      isOpen={isOpen}
      close={close}
    >
      <div className='mb-6 text-lg font-bold'>New Registration Form</div>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(
          createRegistrationFormSchema
        )}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors }) => (
          <Form className='space-y-4 text-sm'>
            <div className='space-y-1'>
              <FormLabel label='Season' htmlFor='seasonId' required />
              <ListBox
                rootClasses=''
                buttonClasses={INPUT_CLASSES}
                options={seasonOptions}
                onChange={(value) => {
                  setFieldValue('seasonId', value);
                }}
                value={values.seasonId}
                buttonText={
                  seasonOptions.find(
                    (option) => option.value === values.seasonId
                  )?.label ?? 'Select a season'
                }
              />
              <ErrorMessage
                name='seasonId'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className='flex flex-col gap-y-1'>
              <FormLabel label='Price (optional)' htmlFor='price' />
              <Field name='price'>
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    type='text'
                    className={INPUT_CLASSES}
                    value={
                      field.value ? Number(field.value).toLocaleString() : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange({
                        target: {
                          name: field.name,
                          value: value !== '' ? Number(value) : 0,
                        },
                      });
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name='price'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className='space-y-1'>
              <FormLabel
                label='Registration Open Date (optional)'
                htmlFor='openDate'
              />
              <Popover
                as='div'
                className='relative flex h-full w-max items-center justify-center rounded-lg'
              >
                <Popover.Button className={GRAY_BOX_CLASSES}>
                  {values.openDate ? (
                    format(values.openDate, 'PPP')
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
                        selected={
                          values.openDate
                            ? new Date(values.openDate)
                            : new Date()
                        }
                        onSelect={(date) => {
                          setFieldValue('openDate', date);

                          close();
                        }}
                      />
                    </div>
                  )}
                </Popover.Panel>
              </Popover>

              <ErrorMessage
                name='closeDate'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className='space-y-1'>
              <FormLabel
                label='Registration Close Date (optional)'
                htmlFor='closeDate'
              />

              <Popover
                as='div'
                className='relative flex h-full w-max items-center justify-center rounded-lg'
              >
                <Popover.Button className={GRAY_BOX_CLASSES}>
                  {values.closeDate ? (
                    format(values.closeDate, 'PPP')
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
                        selected={
                          values.closeDate
                            ? new Date(values.closeDate)
                            : new Date()
                        }
                        onSelect={(date) => {
                          setFieldValue('closeDate', date);

                          close();
                        }}
                      />
                    </div>
                  )}
                </Popover.Panel>
              </Popover>

              <ErrorMessage
                name='closeDate'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                variant={'outline'}
                type='button'
                onClick={close}
                className='rounded border px-4 py-2'
              >
                Cancel
              </Button>
              <Button
                disabled={createRegistrationFormMutation.isLoading}
                type='submit'
                className='rounded px-4 py-2 text-white'
              >
                Create Form
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {createRegistrationFormMutation.isLoading && (
        <div className='absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-slate-300/40'>
          <Spinner width={42} height={42} />
        </div>
      )}
    </Modal>
  );
}
