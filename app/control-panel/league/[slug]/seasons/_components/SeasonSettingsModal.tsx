import { useState } from 'react';
import classNames from 'classnames';
import { Field, Form, Formik, ErrorMessage, FieldProps } from 'formik';
import { Switch } from '@headlessui/react';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import {
  useSeasonSettings,
  useUpdateSeasonSettings,
} from '@/app/lib/hooks/api/control-panel';
import { IconPencilSquare, Spinner } from '@/app/lib/SVGs';
import { SeasonSettings } from '@/app/lib/types/Responses/control-panel.types';
import { Button } from '@/app/lib/components/Button';
import {
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';

/**
 *
 * @param param0
 * @returns
 *
 * @settings
 *
 * 0. season name input
 *
 * - registration controls -
 * 1. enable/disable registration (disable form which disabled registrations)
 * 2. registration capacity
 *
 * 3. max players per team
 * 4.
 * 5.
 *
 */
/*
Possibly use this for season creation
*/

type Props = {
  seasonId: number;
};

export default function SeasonSettingsModal({
  seasonId,
  panelClasses,
  isOpen,
  close,
}: ModalType & Props) {
  const { settings, status } = useSeasonSettings(seasonId);

  const updateSettingsMutation = useUpdateSeasonSettings();

  const [isEditingName, setIsEditingName] = useState(false);

  async function handleUpdate(values: SeasonSettings) {
    await updateSettingsMutation.mutateAsync({
      seasonId,
      formValues: values,
    });

    console.log('values', values);

    close();
  }

  return (
    <Modal panelClasses='sm:w-[450px] w-full' isOpen={isOpen} close={close}>
      <div className='mb-6 text-lg font-medium'>Season Settings</div>
      {settings && status === 'success' && (
        <Formik initialValues={settings} onSubmit={handleUpdate}>
          {({ setFieldValue, values }) => (
            <Form className='space-y-6 text-sm'>
              <div
                className={classNames(
                  isEditingName && 'border-transparent',
                  'border-b'
                )}
              >
                {isEditingName ? (
                  <div className='flex items-center justify-between gap-2'>
                    <Field
                      type='text'
                      name='season.name'
                      className={'text-base ' + INPUT_CLASSES}
                      autoFocus
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => setIsEditingName(false)}
                    >
                      <IconPencilSquare
                        height={18}
                        width={18}
                        color='rgb(74 222 128)'
                      />
                    </Button>
                  </div>
                ) : (
                  <div className='flex h-10 items-center justify-between'>
                    <div className='text-base'>{values.season.name}</div>

                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => setIsEditingName(true)}
                    >
                      <IconPencilSquare height={18} width={18} />
                    </Button>
                  </div>
                )}{' '}
              </div>

              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  label='Maximum Total Teams'
                  htmlFor='max_total_teams'
                  required
                />
                <Field
                  type='number'
                  id='max_total_teams'
                  name='max_total_teams'
                  className={INPUT_CLASSES}
                  min={0}
                />
                <ErrorMessage
                  name='max_total_teams'
                  component='div'
                  className='text-sm text-red-500'
                />
              </div>

              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  label='Maximum Players per Team'
                  htmlFor='max_players_per_team'
                  required
                />
                <Field
                  type='number'
                  id='max_players_per_team'
                  name='max_players_per_team'
                  className={INPUT_CLASSES}
                  min={0}
                />
                <ErrorMessage
                  name='max_players_per_team'
                  component='div'
                  className='text-sm text-red-500'
                />
              </div>
              <div className={INPUT_CONTAINER_CLASSES}>
                <div className='flex items-center justify-between'>
                  <FormLabel
                    label='Enable Registration'
                    htmlFor='registration_enabled'
                  />
                  <Switch
                    checked={values.registration_enabled}
                    onChange={(checked) =>
                      setFieldValue('registration_enabled', checked)
                    }
                    className={`${
                      values.registration_enabled ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className='sr-only'>Enable Registration</span>
                    <span
                      className={`${
                        values.registration_enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              </div>
              <div className={INPUT_CONTAINER_CLASSES}>
                <FormLabel
                  label='Registration Capacity'
                  htmlFor='registration_capacity'
                  required
                />
                <Field
                  type='number'
                  id='registration_capacity'
                  name='registration_capacity'
                  className={INPUT_CLASSES}
                  min={0}
                />
                <ErrorMessage
                  name='registration_capacity'
                  component='div'
                  className='text-sm text-red-500'
                />
              </div>
              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  disabled={updateSettingsMutation.isLoading}
                  type='button'
                  onClick={close}
                  className='px-4 py-2 text-black'
                  variant='outline'
                >
                  Cancel
                </Button>
                <Button type='submit' className='px-4 py-2 text-white'>
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {status === 'loading' && (
        <div className='flex h-[200px] w-full items-center justify-center'>
          <Spinner height={33} width={33} />
        </div>
      )}
    </Modal>
  );
}
