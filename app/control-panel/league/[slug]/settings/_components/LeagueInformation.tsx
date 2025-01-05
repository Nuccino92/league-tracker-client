'use client';

import {
  Formik,
  Form,
  FastField,
  FormikValues,
  ErrorMessage,
  FormikHelpers,
} from 'formik';
import Image from 'next/image';
import classNames from 'classnames';
import { toFormikValidate } from 'zod-formik-adapter';

import FileUpload from '@/app/lib/components/FileUpload';
import ColorPicker from '@/app/lib/components/ColorPicker';
import { DeleteIcon, Spinner } from '@/app/lib/SVGs';
import {
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import {
  LeagueInformationResource,
  leagueInformationSchema,
} from '@/app/lib/types/Resources/CreateLeagueResource';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useUpdateLeague } from '@/app/lib/hooks/api/league';
import { DefaultColors } from '@/app/lib/enums';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import ControlPanelTooltip from '@/app/control-panel/_components/ControlPanelTooltip';

export default function LeagueInformation() {
  const { leagueData, slug } = useLeagueControlPanel();
  const updateLeagueMutation = useUpdateLeague();

  // TODO: validate
  async function handleLeagueInfoSubmit(
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) {
    const valuesToSave = {
      name: values.name,
      logo: values.logo,
      primary_color: values.primary_color,
      secondary_color: values.secondary_color,
      description: values.description ? values.description : null,
    } as LeagueInformationResource;

    await updateLeagueMutation.mutateAsync({
      slug: slug as string,
      formData: valuesToSave,
    });

    formikHelpers.resetForm({
      values: valuesToSave, // Set the form values to the saved values
    });
  }

  const FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES = 'flex items-center gap-2';

  return (
    <div className='h-full'>
      {leagueData ? (
        <main className='flex space-x-6'>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={false}
            initialValues={{
              ...leagueData.league_info,
              description: leagueData.league_info.description ?? '',
            }}
            onSubmit={handleLeagueInfoSubmit}
            validate={toFormikValidate(leagueInformationSchema)}
          >
            {(props) => (
              <Form className='flex w-full min-w-[600px] max-w-[700px] flex-col rounded-xl border border-violet-100 bg-white [@media(min-width:1600px)]:w-[700px]'>
                <div className='border-b p-8 text-2xl font-bold'>
                  League Information
                </div>
                <div className='space-y-6 p-8'>
                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel label='League Name' htmlFor='name' required />{' '}
                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            This input will change the name of this league. It
                            will not effect the url pathname.
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex items-center space-x-2'>
                      <FastField
                        className={INPUT_CLASSES}
                        name='name'
                        id='name'
                        placeholder='Enter your league name'
                      />
                    </div>

                    <ErrorMessage
                      component={'span'}
                      className='text-sm text-red-500'
                      name='name'
                    />
                  </div>
                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel label='League Logo' htmlFor='logo' />

                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            This input will change the logo for this league. If
                            deleted without replacement the league will use the
                            default image provided by keepr.
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex h-[200px] items-center justify-center space-x-2'>
                      {props.values.logo ? (
                        <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
                          <Image
                            src={props.values.logo}
                            alt='Your league icon'
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
                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel label='Name used inside url' htmlFor='slug' />

                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            Request access to change the url path of your league
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex items-center space-x-2'>
                      <input
                        type='text'
                        readOnly
                        disabled
                        className={INPUT_CLASSES + ' !text-gray-400'}
                        name='slug'
                        id='slug'
                        placeholder='League slug name'
                        value={props.values.slug}
                      />
                      {/* <FastField
                      className={INPUT_CLASSES}
                      name='slug'
                      id='slug'
                      placeholder='Enter your league slug'
                    /> */}
                    </div>

                    <ErrorMessage
                      component={'span'}
                      className='text-sm text-red-500'
                      name='slug'
                    />
                  </div>
                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel
                        label='League Description'
                        htmlFor='description'
                      />

                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            This input will change the description used for your
                            league.
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex items-center space-x-2'>
                      <FastField
                        className={classNames(
                          INPUT_CLASSES,
                          'min-h-[200px] !py-2'
                        )}
                        as='textarea'
                        name='description'
                        id='description'
                        placeholder='Enter your league description'
                      />
                    </div>

                    <ErrorMessage
                      component={'span'}
                      className='text-sm text-red-500'
                      name='description'
                    />
                  </div>

                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel
                        label='League Primary Color'
                        htmlFor='primary_color'
                      />

                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            Changing this color will change all the colors where
                            this default color is used.
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={props.values.primary_color}
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
                    </div>
                  </div>
                  <div className={INPUT_CONTAINER_CLASSES}>
                    <div
                      className={FIELD_LABEL_TOOLTIP_CONTAINER_STYLE_CLASSES}
                    >
                      <FormLabel
                        label='League Secondary Color'
                        htmlFor='secondary_color'
                      />
                      <ControlPanelTooltip
                        content={
                          <div className='max-w-[250px]'>
                            Changing this color will change all the colors where
                            this default color is used.
                          </div>
                        }
                        classes='text-white font-medium bg-primary !py-3 text-sm'
                      />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={props.values.secondary_color}
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
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      disabled={!props.dirty || updateLeagueMutation.isLoading}
                      onClick={(e) => {
                        if (!props.dirty) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className={classNames(
                        props.dirty ? 'bg-secondary' : 'bg-gray-300',
                        'w-[140px] rounded border border-violet-100 p-3 font-medium text-white transition-colors duration-100'
                      )}
                      type='submit'
                    >
                      {updateLeagueMutation.isLoading ? (
                        <div className='flex h-full w-full min-w-[100px] items-center justify-center'>
                          <Spinner height={20} width={20} />
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>{' '}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </main>
      ) : null}
    </div>
  );
}
