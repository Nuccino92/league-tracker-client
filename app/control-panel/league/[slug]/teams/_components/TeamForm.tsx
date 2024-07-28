'use client';

import { useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { Form, Formik, FastField, ErrorMessage, FormikValues } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import classNames from 'classnames';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import { DeleteIcon, DownChevronIcon, Spinner } from '@/app/lib/SVGs';
import { useTeam } from '@/app/lib/hooks/api/control-panel/teams';
import { ModalType } from '@/app/types';
import {
  inputClasses,
  inputContainerClasses,
  skeletonClass,
} from '@/app/lib/globals/styles';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import FileUpload from '@/app/lib/components/FileUpload';
import {
  TeamInformationResource,
  teamInformationSchema,
} from '@/app/lib/types/Resources/CreateTeamResource';
import { Button } from '@/app/lib/components/Button';
import ColorPicker from '@/app/lib/components/ColorPicker';
import { DefaultColors } from '@/app/lib/enums';
import Checkbox from '@/app/lib/components/Checkbox';

export default function TeamForm({
  isOpen,
  close,
  teamId,
}: ModalType & { teamId?: number }) {
  const { leagueData, slug } = useLeagueControlPanel();
  const { team, status } = useTeam({
    slug: slug,
    teamId,
  });

  const [isShowAdditionalOptionsChecked, setIsShowAdditionalOptionsChecked] =
    useState(localStorage.getItem('showExtraTeamOptions') ? true : false);

  const [shouldShowAdditionalOptions, setShouldShowAdditionalOptions] =
    useState(isShowAdditionalOptionsChecked);

  const originalNameForHeaderTag = team ? team.name : '';

  function handleSubmit(values: FormikValues) {
    const valuesToSave = {} as TeamInformationResource;

    // return valuesToSave

    console.log('attempting to submit:', values);
  }

  function handleShowAdditionalOptionsClick() {
    if (isShowAdditionalOptionsChecked) {
      localStorage.removeItem('showExtraTeamOptions');
      setIsShowAdditionalOptionsChecked(false);
    } else {
      localStorage.setItem('showExtraTeamOptions', 'true');
      setIsShowAdditionalOptionsChecked(true);
    }
  }

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className=''>
        {status === 'success' && team ? (
          <Formik
            initialValues={team}
            onSubmit={handleSubmit}
            validate={toFormikValidate(teamInformationSchema)}
          >
            {(props) => (
              <Form className='space-y-4'>
                <h4 className='text-2xl font-bold'>
                  {props.values.id
                    ? `${originalNameForHeaderTag}`
                    : 'Create new team'}
                </h4>

                <div className={inputContainerClasses}>
                  <FormLabel label='Name' htmlFor='name' required />
                  <FastField
                    className={inputClasses}
                    name='name'
                    placeholder='Enter name here...'
                  />
                  <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='name'
                  />
                </div>

                <div className='!mb-0 !mt-6 flex items-center justify-between'>
                  <button
                    type='button'
                    className='flex items-center space-x-1 text-sm font-bold hover:text-zinc-600'
                    onClick={() =>
                      setShouldShowAdditionalOptions((prev) => !prev)
                    }
                  >
                    <span className='text-sm'>
                      {shouldShowAdditionalOptions ? 'Hide ' : 'Show extra '}{' '}
                      options
                    </span>
                    <DownChevronIcon height={17} width={17} strokeWidth={2} />
                  </button>

                  <div className='flex items-center space-x-2 text-xs'>
                    <span> Always show extra options?</span>
                    <Checkbox
                      isChecked={isShowAdditionalOptionsChecked}
                      onClick={() => handleShowAdditionalOptionsClick()}
                    />
                  </div>
                </div>

                {shouldShowAdditionalOptions ? (
                  <div className='space-y-4'>
                    <div className={inputContainerClasses}>
                      <FormLabel label='League Logo' htmlFor='logo' />
                      <div className='flex h-[200px] items-center justify-center space-x-2'>
                        {props.values.logo ? (
                          <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
                            <Image
                              src={props.values.logo}
                              alt='Team Logo'
                              style={{ objectFit: 'contain' }}
                              fill
                            />

                            <button
                              onClick={async () => {
                                /*
                                 * TODO:
                                 * await delete from s3
                                 */

                                props.setFieldValue('logo', null);
                              }}
                              className='absolute right-0 m-2 transition-colors hover:text-red-500'
                              type='button'
                            >
                              <DeleteIcon width={24} height={24} />
                            </button>
                          </div>
                        ) : (
                          <FileUpload
                            name='logo'
                            view='control-panel'
                            maxFileSize={500 * 1024}
                            changeEvent={(value) =>
                              props.setFieldValue('logo', value)
                            }
                            errorEvent={(message) =>
                              props.setFieldError('logo', message)
                            }
                          />
                        )}
                      </div>

                      {props.errors.logo ? (
                        <span className='text-sm text-red-500'>
                          {props.errors.logo}
                        </span>
                      ) : null}
                    </div>

                    <div className={inputContainerClasses}>
                      <FormLabel label='Description' htmlFor='description' />
                      <FastField
                        className={classNames(
                          'min-h-[150px] py-2',
                          inputClasses
                        )}
                        name='description'
                        as='textarea'
                        placeholder='Enter description here...'
                      />
                      <ErrorMessage
                        component={'span'}
                        className='text-sm text-red-500'
                        name='description'
                      />
                    </div>

                    <div className={inputContainerClasses}>
                      <FormLabel label='Team Color' htmlFor='primary_color' />
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={
                            props.values.primary_color ?? DefaultColors.Primary
                          }
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            props.setFieldValue('primary_color', color)
                          }
                        />
                        {props.values.primary_color !==
                        DefaultColors.Primary ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              props.setFieldValue(
                                'primary_color',
                                DefaultColors.Primary
                              )
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>
                      <ErrorMessage
                        component={'span'}
                        className='text-sm text-red-500'
                        name='primary_color'
                      />
                    </div>
                    <div className={inputContainerClasses}>
                      <FormLabel
                        label='Secondary Color'
                        htmlFor='secondary_color'
                      />
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={
                            props.values.secondary_color ??
                            DefaultColors.Secondary
                          }
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            props.setFieldValue('secondary_color', color)
                          }
                        />
                        {props.values.secondary_color !==
                        DefaultColors.Secondary ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              props.setFieldValue(
                                'secondary_color',
                                DefaultColors.Secondary
                              )
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>
                      <ErrorMessage
                        component={'span'}
                        className='text-sm text-red-500'
                        name='secondary_color'
                      />
                    </div>
                  </div>
                ) : null}

                <div className='flex w-full justify-end'>
                  <Button
                    type='submit'
                    variant={'secondary'}
                    className='self-end'
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : null}
        {status === 'loading' ? (
          <FormSkeleton showExtraOptions={shouldShowAdditionalOptions} />
        ) : null}
      </div>
    </Modal>
  );
}

function FormSkeleton({ showExtraOptions }: { showExtraOptions: boolean }) {
  return (
    <div className='w-full space-y-4'>
      <div className={classNames('h-8 w-1/2', skeletonClass)} />

      <div className={inputContainerClasses}>
        <div className={classNames('h-4 w-14', skeletonClass)} />
        <div className={classNames('h-8', skeletonClass)} />
      </div>

      <div className='flex w-full items-center justify-between'>
        <div className={classNames('h-5 w-14', skeletonClass)} />
        <div className='flex items-center space-x-1'>
          <div className={classNames('h-5 w-[100px]', skeletonClass)} />
          <div className={classNames('h-5 w-5', skeletonClass)} />
        </div>
      </div>

      {showExtraOptions ? (
        <div className='space-y-4'>
          <div className={inputContainerClasses}>
            <div className={classNames('h-4 w-14', skeletonClass)} />
            <div className={classNames('h-[150px]', skeletonClass)} />
          </div>
          <div className={inputContainerClasses}>
            <div className={classNames('h-4 w-14', skeletonClass)} />
            <div className={classNames('h-[150px]', skeletonClass)} />
          </div>
          <div className={inputContainerClasses}>
            <div className={classNames('h-4 w-14', skeletonClass)} />
            <div className={classNames('h-8 w-[80px]', skeletonClass)} />
          </div>
          <div className={inputContainerClasses}>
            <div className={classNames('h-4 w-14', skeletonClass)} />
            <div className={classNames('h-8 w-[80px]', skeletonClass)} />
          </div>
        </div>
      ) : null}

      <div className='flex w-full justify-end'>
        <div className={classNames('h-10 w-[100px]', skeletonClass)} />
      </div>
    </div>
  );
}
