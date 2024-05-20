'use client';

import { Fragment, ReactNode, useState } from 'react';
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
import { Listbox, Transition } from '@headlessui/react';

import FileUpload from '@/app/lib/components/FileUpload';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/lib/components/Tooltip';
import ColorPicker from '@/app/lib/components/ColorPicker';
import CreateNewSeasonModal from '../../_components/CreateNewSeasonModal';
import ConcludeSeasonModal from '../../_components/ConcludeSeasonModal';
import { deleteIcon, downChevronIcon } from '@/app/lib/SVGs';
import {
  inputClasses,
  inputContainerClasses,
} from '@/app/lib/constants/styles';
import {
  LeagueInformationResource,
  leagueInformationSchema,
} from '@/app/lib/types/Resources/CreateLeagueResource';
import Container from '../../_components/Container';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { useUpdateLeague } from '@/app/lib/hooks/api/league';

export default function LeagueControlPanelPage() {
  const { leagueData } = useLeagueControlPanel();
  const updateLeagueMutation = useUpdateLeague();

  const [showConcludeSeasonModal, setShowConcludeSeasonModal] = useState(false);
  const [showCreateNewSeasonModal, setCreateNewSeasonModal] = useState(false);

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
      slug: leagueData?.league_info.slug as string,
      formData: valuesToSave,
    });

    formikHelpers.resetForm({
      values: valuesToSave, // Set the form values to the saved values
    });
  }

  function handleSeasonsSubmit(values: FormikValues) {}

  return (
    <Container view='league'>
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
                <Form className='flex w-full flex-col space-y-6 rounded-xl border border-violet-100 bg-white p-6 md:w-[650px]'>
                  <div className='text-2xl font-bold'>League Information</div>
                  <div className={inputContainerClasses}>
                    <FormLabel name='League Name' htmlFor='name' required />
                    <div className='flex items-center space-x-2'>
                      <FastField
                        className={inputClasses}
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
                  <div className={inputContainerClasses}>
                    <FormLabel name='League Logo' htmlFor='logo' />
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

                              props.handleChange({
                                target: {
                                  name: 'logo',
                                  value: null,
                                },
                              });
                            }}
                            className='absolute right-0 m-2 transition-colors hover:text-red-500'
                            type='button'
                          >
                            {deleteIcon}
                          </button>
                        </div>
                      ) : (
                        <FileUpload
                          name='logo'
                          view='control-panel'
                          maxFileSize={500 * 1024}
                          changeEvent={(value) =>
                            props.handleChange({
                              target: {
                                name: 'logo',
                                value: value,
                              },
                            })
                          }
                          errorEvent={(message) => {
                            return props.setErrors({
                              ...props.errors,
                              logo: message,
                            });
                          }}
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

                    {/* <ErrorMessage
                    component={'span'}
                    className='text-sm text-red-500'
                    name='logo'
                  /> */}
                  </div>
                  <div className={inputContainerClasses}>
                    <FormLabel name='Name used inside url' htmlFor='slug' />
                    <div className='flex items-center space-x-2'>
                      <input
                        type='text'
                        readOnly
                        disabled
                        className={inputClasses + ' !text-gray-400'}
                        name='slug'
                        id='slug'
                        placeholder='League slug name'
                        value={props.values.slug}
                      />
                      {/* <FastField
                      className={inputClasses}
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
                  <div className={inputContainerClasses}>
                    <FormLabel
                      name='League Description'
                      htmlFor='description'
                    />
                    <div className='flex items-center space-x-2'>
                      <FastField
                        className={classNames(
                          inputClasses,
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

                  <div className={inputContainerClasses}>
                    <FormLabel
                      name='League Primary Color'
                      htmlFor='primary_color'
                    />
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={props.values.primary_color}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            props.handleChange({
                              target: {
                                name: 'primary_color',
                                value: color,
                              },
                            })
                          }
                        />
                        {props.values.primary_color !== '#00337C' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              props.handleChange({
                                target: {
                                  name: 'primary_color',
                                  value: '#00337C',
                                },
                              })
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
                  <div className={inputContainerClasses}>
                    <FormLabel
                      name='League Secondary Color'
                      htmlFor='secondary_color'
                    />
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={props.values.secondary_color}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            props.handleChange({
                              target: {
                                name: 'secondary_color',
                                value: color,
                              },
                            })
                          }
                        />

                        {props.values.secondary_color !== '#03C988' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              props.handleChange({
                                target: {
                                  name: 'secondary_color',
                                  value: '#03C988',
                                },
                              })
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

            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              validateOnMount={false}
              initialValues={initialSeasonsValues}
              onSubmit={handleSeasonsSubmit}
            >
              {(props) => (
                <Form className='flex h-max w-full flex-col space-y-6 rounded-xl border border-violet-100 bg-white p-6 md:w-[650px]'>
                  <div className='text-2xl font-bold'>Season Management</div>
                  <div className={inputContainerClasses}>
                    <FormLabel name='All Seasons' htmlFor='seasons' />
                    {props.values.all_seasons &&
                    props.values.all_seasons.length !== 0 ? (
                      <div className='flex items-center space-x-2'>
                        <Listbox
                          value={props.values.all_seasons.find(
                            (season) => season.id === props.values.active_season
                          )}
                        >
                          <div className='relative w-full'>
                            <Listbox.Button
                              id='listbox-button-id'
                              type='button'
                              className={classNames(
                                inputClasses,
                                'flex items-center justify-between'
                              )}
                            >
                              <span>
                                {props.values.all_seasons.find(
                                  (season) =>
                                    season.id === props.values.active_season
                                )?.name ?? 'Select from dropdown to activate'}
                              </span>
                              <span>{downChevronIcon}</span>
                            </Listbox.Button>

                            <Transition
                              as={Fragment}
                              leave='transition ease-in duration-100'
                              leaveFrom='opacity-100'
                              leaveTo='opacity-0'
                            >
                              <Listbox.Options className='absolute mt-1 w-full overflow-auto rounded-md border border-violet-100 bg-white text-base'>
                                {props.values.all_seasons.map((season) => (
                                  <Listbox.Option
                                    onClick={(e) => {
                                      if (props.values.active_season) {
                                        e.preventDefault();
                                        return e.stopPropagation();
                                      } else {
                                        try {
                                          // TODO: add api call to set this as the active season
                                          // TODO: give prompt telling them that this will activate this older season
                                          props.handleChange({
                                            target: {
                                              name: 'active_season',
                                              value: season.id,
                                            },
                                          });
                                          console.log(season);
                                        } catch (error) {
                                          console.log(error);
                                        }
                                      }
                                    }}
                                    className={classNames(
                                      props.values.active_season
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer',
                                      ' px-2 py-2 hover:bg-secondary hover:text-white'
                                    )}
                                    key={season.id}
                                    value={season.id}
                                  >
                                    {season.name}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>

                        <ControlPanelTooltip
                          content={
                            <div className='max-w-[250px]'>
                              This is a list of every season. You may
                              re-activate a previous season, but only if there
                              is no season currently active.
                            </div>
                          }
                          classes='text-white font-medium bg-primary !py-3 text-sm'
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className={inputContainerClasses}>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col'>
                        <FormLabel
                          name='Active Season'
                          htmlFor='active season'
                        />
                        <span className='font-medium'>
                          {props.values.active_season ? (
                            props.values.all_seasons.find(
                              (season) =>
                                season.id === props.values.active_season
                            )?.name
                          ) : (
                            <span className='italic'>
                              No current active season
                            </span>
                          )}
                        </span>
                      </div>

                      {props.values.active_season ? (
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => setShowConcludeSeasonModal(true)}
                            className='rounded-md border border-violet-100 bg-secondary p-3 text-sm font-medium text-white'
                            type='button'
                          >
                            Conclude Season
                          </button>
                          <ControlPanelTooltip
                            content={
                              <div className='max-w-[250px]'>
                                Concluding this active season will prevent any
                                game from being submitted.
                              </div>
                            }
                            classes='text-white font-medium bg-primary !py-3 text-sm'
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setCreateNewSeasonModal(true)}
                          className='rounded-md border border-violet-100 bg-secondary p-3 text-sm font-medium text-white'
                          type='button'
                        >
                          Create Season
                        </button>
                      )}
                    </div>
                  </div>

                  <CreateNewSeasonModal
                    updateSeasons={(newSeason, shouldNewSeasonBeActive) => {
                      props.setValues({
                        active_season: shouldNewSeasonBeActive
                          ? newSeason.id
                          : props.values.active_season,
                        all_seasons: [...props.values.all_seasons, newSeason],
                      });
                      setCreateNewSeasonModal(false);
                    }}
                    panelClasses='sm:w-[450px] w-full'
                    isOpen={showCreateNewSeasonModal}
                    close={() => setCreateNewSeasonModal(false)}
                  />
                  <ConcludeSeasonModal
                    formikProps={props}
                    panelClasses='sm:w-[450px] w-full'
                    isOpen={showConcludeSeasonModal}
                    close={() => {
                      // TODO: send api request to conclude season
                      setShowConcludeSeasonModal(false);
                    }}
                  />
                </Form>
              )}
            </Formik>
          </main>
        ) : null}
      </div>
    </Container>
  );
}

const initialSeasonsValues = {
  all_seasons: [
    { id: '1', name: '2019-2020 Bball season' }, //TODO: possible add created_at to sort
    { id: '2', name: '2020-2021 Bball season' },
    { id: '3', name: '2021-2022 Bball season' },
    { id: '4', name: '2022-2023 Bball season' },
  ],
  active_season: '4', // nullable,
};

function FormLabel({
  name,
  htmlFor,
  required,
}: {
  name: string;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label className='font-bold' htmlFor={htmlFor}>
      <span>{name}</span>{' '}
      {required ? <span className='text-red-500'>*</span> : null}
    </label>
  );
}

function ControlPanelTooltip({
  content,
  classes,
}: {
  content: ReactNode;
  classes?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={(e) => e.preventDefault()}
          className='transition-all duration-75 hover:text-yellow-300'
        >
          {toolTipIcon}
        </TooltipTrigger>
        <TooltipContent className={classes}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const toolTipIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
    />
  </svg>
);
