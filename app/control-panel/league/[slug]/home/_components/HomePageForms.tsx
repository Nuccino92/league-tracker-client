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
import { DeleteIcon } from '@/app/lib/SVGs';
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

export default function HomePageForms() {
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

  return (
    <div className='h-full'>
      {leagueData ? (
        <main className='flex justify-center space-x-6'>
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
              <Form className='flex w-full flex-col space-y-6 rounded-xl border border-violet-100 bg-white p-6 md:w-[900px]'>
                <div className='text-2xl font-bold'>League Information</div>
                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel label='League Name' htmlFor='name' required />
                  <div className='flex items-center space-x-2'>
                    <FastField
                      className={INPUT_CLASSES}
                      name='name'
                      id='name'
                      placeholder='Enter your league name'
                    />
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

                  <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='name'
                  />
                </div>
                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel label='League Logo' htmlFor='logo' />
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

                  {props.errors.logo ? (
                    <span className='text-sm text-red-500'>
                      {props.errors.logo}
                    </span>
                  ) : null}
                </div>
                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel label='Name used inside url' htmlFor='slug' />
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
                    <ControlPanelTooltip
                      content={
                        <div className='max-w-[250px]'>
                          Request access to change the url path of your league
                        </div>
                      }
                      classes='text-white font-medium bg-primary !py-3 text-sm'
                    />
                  </div>

                  <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='slug'
                  />
                </div>
                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel label='League Description' htmlFor='description' />
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

                  <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='description'
                  />
                </div>

                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel
                    label='League Primary Color'
                    htmlFor='primary_color'
                  />
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <ColorPicker
                        color={props.values.primary_color}
                        buttonClasses='w-[100px]'
                        saveColor={(color: string) =>
                          props.setFieldValue('primary_color', color)
                        }
                      />
                      {props.values.primary_color !== DefaultColors.Primary ? (
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
                </div>
                <div className={INPUT_CONTAINER_CLASSES}>
                  <FormLabel
                    label='League Secondary Color'
                    htmlFor='secondary_color'
                  />
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
                </div>
                <button
                  onClick={(e) => {
                    if (!props.dirty) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className={classNames(
                    props.dirty ? 'bg-secondary' : 'bg-gray-300',
                    'rounded border border-violet-100  p-3 font-medium text-white transition-colors duration-100'
                  )}
                  type='submit'
                >
                  Save Changes
                </button>
              </Form>
            )}
          </Formik>
        </main>
      ) : null}
    </div>
  );
}
