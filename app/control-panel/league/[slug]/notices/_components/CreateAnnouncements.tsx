'use client';

import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import classNames from 'classnames';
import { z } from 'zod';
import { Switch, Popover } from '@headlessui/react';

import FormLabel from '@/app/control-panel/_components/FormLabel';
import { Button } from '@/app/lib/components/Button';
import Modal from '@/app/lib/components/Modal';
import StyledBox from '@/app/lib/components/StyledBox';
import {
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import { IconPlus, Spinner } from '@/app/lib/SVGs';
import { ModalType } from '@/app/types';
import { BaseTeam } from '@/app/lib/types/Models/Team';
import { format } from 'date-fns';
import { Calendar } from '@/app/lib/components/Calendar';
import { useNoticeStatistics } from '@/app/lib/hooks/api/control-panel/notices';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';

export default function CreateAnnouncement() {
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] =
    useState(false);

  return (
    <div>
      <StyledBox classes='flex items-center justify-end p-4'>
        {/* TODO: disable if the season isn't on a paid subscription */}
        <Button
          className='flex !h-10 items-center gap-2'
          onClick={() => setShowCreateAnnouncementModal(true)}
        >
          <IconPlus /> Create Notice
        </Button>
      </StyledBox>

      {showCreateAnnouncementModal && (
        <CreateAnnouncementModal
          isOpen={showCreateAnnouncementModal}
          close={() => setShowCreateAnnouncementModal(false)}
        />
      )}
    </div>
  );
}

const announcementFormValueSchema = z.object({
  title: z.string({ required_error: 'Please enter a title' }).min(1).max(255),
  content: z
    .string({ required_error: 'Please enter the message' })
    .min(1)
    .max(750),
  delivery_types: z.array(z.enum(['email', 'sms', 'website'])).min(1),
  recipient_type: z
    .enum(['teams', 'players', 'registrants', 'members'])
    .nullable(),
  scope: z
    .enum([
      // Player scopes
      'allPlayers',
      'allTeams',
      'selectedPlayers',
      'selectedTeams',
      'league',
      // Registrant scopes
      'allRegistrants',
      // Member scopes
      'allMembers',
      'selectedRoles',
      'specificMembers',
    ])
    .nullable(),
  teams: z.array(z.number()),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormValueSchema>;

function CreateAnnouncementModal({ isOpen, close }: ModalType) {
  const { data, status } = useNoticeStatistics();
  const { credits_remaining } = data || {};

  const [step, setStep] = useState(1);

  const initialValues: AnnouncementFormValues = {
    title: '',
    content: '',
    delivery_types: [],
    recipient_type: null, // 'players' or 'registrants' or 'members'
    scope: null, // 'all', 'season', or 'teams'
    teams: [],
    start_date: null,
    end_date: null,
  };

  function handleSubmit(values: AnnouncementFormValues) {
    console.log('Form Values:', values);

    if (step === 1) {
      setStep((prev) => prev + 1);
    }

    if (step === 2) {
      if (values.delivery_types.includes('website')) {
        // todo: call backend to create notice
        console.log('Post to website');
      } else {
        setStep((prev) => prev + 1);
      }

      //  setStep((prev) => prev + 1);
    }

    // todo: only submit if the step is the confirmed last step in the form
  }

  /**
   * todo: implement preview feature
   */

  // need delivery_types ['email', 'sms', 'website']
  // if website then need start_date and end_date, is_pinned, display_location ['league_website', 'team_page']
  // need to be able to select, team vs player vs registrant. Also, specific teams, players, registrants

  /**
   *
   * todo: show texts being sent, emails being sent (totals)
   *
   * add another receipient type, members
   *
   * should split up form into steps, members can be selected by role or specific members
   */

  const deliveryTypes = [
    { value: 'email', label: 'Send Email' },
    { value: 'sms', label: 'Send Text message' },
    { value: 'website', label: 'Post on Website' },
  ];

  const receipients = [
    {
      value: 'players',
      label: 'Players',
    },
    { value: 'registrants', label: 'Registrants' },
    { value: 'members', label: 'Members' },
  ];

  const teamScopeOptions = {
    currentSeason: {
      header: 'Current Season',
      options: [
        { value: 'allTeams', label: 'All Teams' },
        { value: 'selectedTeams', label: 'Select Teams' },
      ],
    },
    global: null,
  };

  const playersScopeOptions = {
    currentSeason: {
      header: 'Current Season',
      options: [
        { value: 'allPlayes', label: 'All Players' },
        { value: 'selectedPlayers', label: 'Select Players' },
      ],
    },
    global: {
      header: 'Global',
      options: [{ value: 'league', label: 'All in League' }],
    },
  };

  const registrantsScopeOptions = {
    currentSeason: {
      header: 'Current Season',
      options: [{ value: 'allRegistrants', label: 'All Registrants' }],
    },
  };
  const membersScopeOptions = {
    allMembers: {
      header: 'All Members',
      options: [{ value: 'allMembers', label: 'All Members' }],
    },
    selectedRoles: {
      header: 'Selected Roles',
      options: [{ value: 'selectedRoles', label: 'Select Roles' }],
    },
    specificMembers: {
      header: 'Specific Members',
      options: [{ value: 'specificMembers', label: 'Select Members' }],
    },
  };

  const teams: BaseTeam[] = [];

  //todo: count the total emails/sms to be used with this notice
  //todo: allow user to save for later or save + send

  /**
   * if receipient_type
   * 1. players
   * - current season: all players, all players in selected teams, specific players
   * - global: all players in league
   * 2. registrants
   * - current season: all registrants
   * 3. members
   * - all members, selected roles, specific members
   */

  return (
    <Modal
      panelClasses='sm:w-[640px] w-full rounded-xl !overflow-visible'
      isOpen={isOpen}
      close={close}
    >
      <div>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: Partial<typeof initialValues> = {};

            if (step === 1) {
              try {
                const schema = z.object({
                  title: z
                    .string({ required_error: 'Please enter a title' })
                    .min(1, { message: 'Please enter a title' })
                    .max(255),
                  content: z
                    .string({ required_error: 'Please enter the message' })
                    .min(1, { message: 'Please enter the notice' })
                    .max(750),
                });

                schema.parse(values);
              } catch (error) {
                if (error instanceof z.ZodError) {
                  error.errors.forEach((err) => {
                    errors[err.path[0] as keyof typeof initialValues] =
                      err.message as any;
                  });
                }
              }
            }

            if (step === 2) {
              if (values.delivery_types.includes('website')) {
                if (!values.start_date) {
                  errors.start_date = 'Please select a start date' as any;
                }

                if (!values.end_date) {
                  errors.end_date = 'Please select an end date' as any;
                }
              }
            }

            if (step === 3) {
            }

            return errors;
          }}
        >
          {({ values, setFieldValue, errors, setErrors }) => (
            <Form className='space-y-6'>
              <div className='mb-6 pr-7 text-lg font-bold'>
                {step === 1 ? 'Create Notice' : values.title}
              </div>
              <div className=''>
                {step === 1 && (
                  <div className='space-y-6'>
                    {/* Title */}
                    <div className={INPUT_CONTAINER_CLASSES}>
                      <FormLabel htmlFor='title' required label='Title' />
                      <Field
                        className={classNames('text-sm', INPUT_CLASSES)}
                        name='title'
                        placeholder='Enter your title here'
                      />

                      <ErrorMessage
                        name='title'
                        className='text-sm text-red-500'
                        component={'div'}
                      />
                    </div>

                    {/* todo: convert to WYSIWYG  */}
                    {/* Content */}
                    <div className={INPUT_CONTAINER_CLASSES}>
                      <FormLabel htmlFor='content' required label='Notice' />
                      <Field
                        className={classNames(
                          'h-[150px] resize-none py-2 text-sm',
                          INPUT_CLASSES
                        )}
                        name='content'
                        as='textarea'
                        placeholder='Enter your notice here'
                      />

                      <ErrorMessage
                        name='content'
                        className='text-sm text-red-500'
                        component={'div'}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className='space-y-10'>
                    <div className=''>
                      {/* Delivery Types */}
                      <div className={INPUT_CONTAINER_CLASSES}>
                        <div className='space-y-4'>
                          {deliveryTypes.map((type) => {
                            const checked = values.delivery_types.includes(
                              type.value as 'email' | 'sms' | 'website'
                            );
                            return (
                              <div
                                key={type.value}
                                className='flex items-center justify-between space-x-2 text-sm'
                              >
                                <label
                                  className='select-none font-medium'
                                  htmlFor={type.value}
                                >
                                  {type.label}
                                </label>

                                <Switch
                                  checked={checked}
                                  onChange={() => {
                                    setErrors({});
                                    if (checked) {
                                      const removedType =
                                        values.delivery_types.filter(
                                          (dt) => dt !== type.value
                                        );

                                      setFieldValue(
                                        'delivery_types',
                                        removedType
                                      );

                                      if (
                                        !removedType.includes('email') &&
                                        !removedType.includes('sms')
                                      ) {
                                        setFieldValue('recipient_type', null);
                                        setFieldValue('scope', null);
                                        setFieldValue('teams', []);
                                      }
                                    } else {
                                      if (type.value === 'website') {
                                        setFieldValue('delivery_types', [
                                          'website',
                                        ]);
                                        setFieldValue('recipient_type', null);
                                        setFieldValue('scope', null);
                                        setFieldValue('teams', []);
                                      } else {
                                        const newTypes = [
                                          ...values.delivery_types.filter(
                                            (dt) => dt !== 'website'
                                          ),
                                          type.value as
                                            | 'email'
                                            | 'sms'
                                            | 'website',
                                        ];
                                        setFieldValue(
                                          'delivery_types',
                                          newTypes
                                        );
                                      }
                                    }
                                  }}
                                  className={classNames(
                                    checked ? 'bg-primary' : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 items-center rounded-full'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      checked
                                        ? 'translate-x-6'
                                        : 'translate-x-1',
                                      'inline-block h-4 w-4 transform rounded-full bg-white transition'
                                    )}
                                  />
                                </Switch>
                              </div>
                            );
                          })}{' '}
                        </div>
                      </div>
                      {values.delivery_types.includes('website') && (
                        <div>
                          <p className='my-4 rounded-md bg-secondary/10 p-3 text-xs text-gray-500'>
                            This message will be placed at the top of the
                            website
                          </p>

                          <div className='flex items-center space-x-4'>
                            <span className='text-sm'>From</span>
                            <Popover
                              as='div'
                              className='relative flex h-full w-max items-center justify-center rounded-lg'
                            >
                              <Popover.Button
                                type='button'
                                className='rounded-md bg-primary p-2 text-sm text-white shadow hover:bg-primary/90'
                              >
                                {values.start_date ? (
                                  format(values.start_date, 'PPP')
                                ) : (
                                  <span>Start date</span>
                                )}
                              </Popover.Button>

                              <Popover.Panel aria-label='Open Date'>
                                {({ close }) => (
                                  <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                                    <Calendar
                                      showOutsideDays={false}
                                      disabled={{
                                        before: new Date(),
                                      }}
                                      mode='single'
                                      selected={
                                        values.start_date
                                          ? new Date(values.start_date)
                                          : undefined
                                      }
                                      onSelect={(date) => {
                                        if (!date) return;

                                        setFieldValue('start_date', date);
                                        setFieldValue('end_date', null);

                                        close();
                                      }}
                                    />
                                  </div>
                                )}
                              </Popover.Panel>
                            </Popover>
                            <span className='text-sm'>to</span>
                            <Popover
                              as='div'
                              className='relative flex h-full w-max items-center justify-center rounded-lg'
                            >
                              <Popover.Button
                                type='button'
                                className='rounded-md bg-primary p-2 text-sm text-white shadow hover:bg-primary/90'
                              >
                                {values.end_date ? (
                                  format(values.end_date, 'PPP')
                                ) : (
                                  <span>End date</span>
                                )}
                              </Popover.Button>

                              <Popover.Panel aria-label='Open Date'>
                                {({ close }) => (
                                  <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
                                    <Calendar
                                      showOutsideDays={false}
                                      disabled={{
                                        before: values.start_date
                                          ? values.start_date
                                          : new Date(),
                                      }}
                                      mode='single'
                                      selected={
                                        values.end_date
                                          ? new Date(values.end_date)
                                          : undefined
                                      }
                                      onSelect={(date) => {
                                        if (!date) return;

                                        setFieldValue('end_date', date);

                                        close();
                                      }}
                                    />
                                  </div>
                                )}
                              </Popover.Panel>
                            </Popover>
                          </div>
                        </div>
                      )}

                      {errors.start_date || errors.end_date ? (
                        <div className='mt-4 text-sm text-red-500'>
                          Please fill out the dates
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Email/SMS recipients */}
                {step === 3 && (
                  <div>
                    {values.delivery_types.includes('email') ||
                    values.delivery_types.includes('sms') ? (
                      <div>
                        <div className='mb-4 flex items-center justify-start gap-2 font-bold text-gray-500'>
                          {values.delivery_types.includes('email') && (
                            <span>Email</span>
                          )}

                          {values.delivery_types.includes('sms') && (
                            <span> Text Message </span>
                          )}
                        </div>
                        {/* Receipient */}
                        <div>
                          <div className='font-medium'>Select the group:</div>

                          {/* First Level */}
                          <div className='mt-4 space-x-4 text-sm'>
                            {receipients.map((type) => {
                              return (
                                <button
                                  key={type.value}
                                  disabled={
                                    !values.delivery_types.includes('email') &&
                                    !values.delivery_types.includes('sms')
                                  }
                                  className={classNames(
                                    values.recipient_type === type.value
                                      ? 'border-secondary bg-secondary'
                                      : '',
                                    'rounded border border-primary bg-primary p-2 font-medium text-white disabled:opacity-40'
                                  )}
                                  role='radio'
                                  aria-checked={
                                    values.recipient_type === type.value
                                  }
                                  type='button'
                                  onClick={() => {
                                    if (values.recipient_type === type.value) {
                                      setFieldValue('recipient_type', null);
                                    } else {
                                      setFieldValue(
                                        'recipient_type',
                                        type.value
                                      );
                                    }

                                    setFieldValue('scope', '');
                                    setFieldValue('teams', []);
                                  }}
                                >
                                  {type.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Second Level: Scope Selection */}
                          {values.recipient_type &&
                            values.recipient_type === 'players' && (
                              <div className='mb-4 space-y-2'>
                                <div className='space-y-1 text-sm'>
                                  <div>Current Season</div>

                                  <div>
                                    <button
                                      className={classNames(
                                        values.scope === 'season'
                                          ? 'border-secondary bg-secondary/10 text-secondary'
                                          : 'border-slate-300 bg-slate-50',
                                        'rounded border px-2 py-1 font-medium disabled:opacity-40'
                                      )}
                                      role='radio'
                                      aria-checked={values.scope === 'season'}
                                      type='button'
                                      onClick={() => {
                                        setFieldValue('scope', 'season');
                                        setFieldValue('teams', []);
                                      }}
                                    >
                                      All Players
                                    </button>

                                    <button
                                      className={classNames(
                                        values.scope === 'teams'
                                          ? 'border-secondary bg-secondary/10 text-secondary'
                                          : 'border-slate-300 bg-slate-50',
                                        'rounded border px-2 py-1 font-medium disabled:opacity-40'
                                      )}
                                      role='radio'
                                      aria-checked={values.scope === 'teams'}
                                      type='button'
                                      onClick={() => {
                                        setFieldValue('scope', 'teams');
                                        setFieldValue('teams', []);
                                      }}
                                    >
                                      All Teams
                                    </button>

                                    <button
                                      className={classNames(
                                        values.scope === 'teams'
                                          ? 'border-secondary bg-secondary/10 text-secondary'
                                          : 'border-slate-300 bg-slate-50',
                                        'rounded border px-2 py-1 font-medium disabled:opacity-40'
                                      )}
                                      role='radio'
                                      aria-checked={values.scope === 'teams'}
                                      type='button'
                                      onClick={() => {
                                        setFieldValue('scope', 'teams');
                                        setFieldValue('teams', []);
                                      }}
                                    >
                                      Select Teams
                                    </button>
                                    <button
                                      className={classNames(
                                        values.scope === 'players'
                                          ? 'border-secondary bg-secondary/10 text-secondary'
                                          : 'border-slate-300 bg-slate-50',
                                        'rounded border px-2 py-1 font-medium disabled:opacity-40'
                                      )}
                                      role='radio'
                                      aria-checked={values.scope === 'players'}
                                      type='button'
                                      onClick={() => {
                                        setFieldValue('scope', 'players');
                                        setFieldValue('teams', []);
                                      }}
                                    >
                                      Select Players
                                    </button>
                                  </div>
                                </div>

                                <div className='space-y-1 text-sm'>
                                  <div>Global</div>

                                  <div>
                                    <button
                                      className={classNames(
                                        values.scope === 'league'
                                          ? 'border-secondary bg-secondary/10 text-secondary'
                                          : 'border-slate-300 bg-slate-50',
                                        'rounded border px-2 py-1 font-medium disabled:opacity-40'
                                      )}
                                      role='radio'
                                      aria-checked={values.scope === 'league'}
                                      type='button'
                                      onClick={() => {
                                        setFieldValue('scope', 'league');
                                        setFieldValue('teams', []);
                                      }}
                                    >
                                      All in League
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Third Level: Team Selection (if applicable) */}
                          {values.recipient_type === 'players' &&
                            values.scope === 'teams' && (
                              <div className='mb-4'>
                                <FormLabel
                                  htmlFor='teams'
                                  required
                                  label='Select Teams'
                                />
                                <div className='max-h-40 space-y-2 overflow-y-auto rounded border p-2'>
                                  {teams.map((team) => (
                                    <label
                                      key={team.id}
                                      className='flex items-center gap-2'
                                    >
                                      <input
                                        type='checkbox'
                                        checked={values.teams.includes(team.id)}
                                        onChange={(e) => {
                                          const newTeams = e.target.checked
                                            ? [...values.teams, team.id]
                                            : values.teams.filter(
                                                (id) => id !== team.id
                                              );
                                          setFieldValue('teams', newTeams);
                                        }}
                                      />
                                      <span>{team.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ) : null}

                    {/* TODO: need to display indicator if exceeding remaining with group selection */}
                    <div className='mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-sm'>
                      {values.delivery_types.includes('email') && (
                        <div className='flex items-center justify-between'>
                          <span>Emails to be sent</span>{' '}
                          {credits_remaining && (
                            <span>{`${0} / ${credits_remaining.email.remaining}`}</span>
                          )}
                        </div>
                      )}

                      {values.delivery_types.includes('sms') && (
                        <div className='flex items-center justify-between'>
                          <span>Text messages to be sent</span>{' '}
                          {credits_remaining && (
                            <span>{`${0} / ${credits_remaining.sms.remaining}`}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className='flex items-center justify-between'>
                {step !== 1 ? (
                  <Button
                    type='button'
                    onClick={() => {
                      if (step === 1) return;
                      setStep((prev) => prev - 1);
                    }}
                    className='border-0 bg-slate-50 !text-black hover:bg-slate-100 disabled:opacity-40'
                  >
                    Previous
                  </Button>
                ) : (
                  <span />
                )}

                {/* Possibly add preview */}
                <Button
                  type='submit'
                  disabled={step === 2 && values.delivery_types.length === 0}
                >
                  {' '}
                  {step === 1 && 'Next'}{' '}
                  {step === 2 &&
                    values.delivery_types.includes('website') &&
                    'Post'}
                  {step === 2 &&
                    values.delivery_types.length === 0 &&
                    'Select Option'}
                  {(step === 2 && values.delivery_types.includes('email')) ||
                  values.delivery_types.includes('sms')
                    ? 'Select Group'
                    : ''}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

interface SearchableListProps {
  title: string;
  scope: 'currentSeason' | 'global';
  useQuery: (params: { givenParams: string }) => {
    data: any[];
    status: string;
  };
  searchPlaceholder: string;
}

//Use for all the options
function SearchableList({
  title,
  scope,
  useQuery,
  searchPlaceholder,
}: SearchableListProps) {
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 750); //todo: remove this debounce if we are not paginating

  //todo: remove this debounce if we are not paginating
  const params = `search=${debouncedSearch}${scope === 'currentSeason' ? '&season=12' : ''}`;
  const { data, status } = useQuery({ givenParams: params });

  return (
    <Popover as='div' className='relative'>
      <Popover.Button>{title}</Popover.Button>

      <Popover.Panel as='div' className='relative'>
        <SearchBar
          inputValue={query}
          setInputValue={setQuery}
          placeholder={searchPlaceholder}
          searchIconSize={22}
          closeIconSize={20}
        />

        <div className='bg-white shadow'>
          {status === 'success' &&
            data?.map((item) => <div key={item.id}>{item.name}</div>)}

          {status === 'loading' && (
            <div className='flex items-center justify-center'>
              <Spinner height={19} width={19} />
            </div>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  );
}
