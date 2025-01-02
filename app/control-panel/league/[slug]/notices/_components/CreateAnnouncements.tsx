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
import {
  useNoticeSelectionScopeTotals,
  useNoticeStatistics,
} from '@/app/lib/hooks/api/control-panel/notices';
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
  recipient_type: z.enum(['team', 'player', 'registrant', 'member']).nullable(),
  scope: z.enum(['all', 'specific', 'roles', 'global_all']).nullable(),
  teams: z.array(z.number()),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormValueSchema>;

function CreateAnnouncementModal({ isOpen, close }: ModalType) {
  const { data, status } = useNoticeStatistics();

  const { totals, status: totalsStatus } = useNoticeSelectionScopeTotals();

  console.log('totes', totals);

  const { credits_remaining } = data || {};

  const [step, setStep] = useState(1);

  const initialValues: AnnouncementFormValues = {
    title: '',
    content: '',
    delivery_types: [],
    recipient_type: null, // 'players' or 'registrants' or 'members' or 'teams'
    scope: null, // 'all', 'specific', 'roles', 'global_all'
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
      value: 'player',
      label: 'Players',
    },
    { value: 'team', label: 'Teams' },
    { value: 'registrant', label: 'Registrants' },
    { value: 'member', label: 'Members' },
  ];

  type ScopeOptionType = {
    team: Array<{ value: string; label: string }>;
    player: Array<{ value: string; label: string }>;
    registrant: Array<{ value: string; label: string }>;
    member: Array<{ value: string; label: string }>;
  };

  const scopeOptions: ScopeOptionType = {
    team: [
      { value: 'all', label: 'All Teams in Season' },
      { value: 'specific', label: 'Select Teams' },
    ],
    player: [
      { value: 'all', label: 'All Players in Season' },
      { value: 'specific', label: 'Select Players' },
      { value: 'global_all', label: 'All Players in League' },
    ],
    registrant: [
      { value: 'all', label: 'All Registrants in Season' },
      { value: 'specific', label: 'Select Registrants' },
    ],
    member: [
      { value: 'global_all', label: 'All members in league' },
      { value: 'specific', label: 'Select Members' },
      { value: 'roles', label: 'Select Roles' },
    ],
  };

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

  const [totalEmailsToBeSent, setTotalEmailsToBeSent] = useState(0);
  const [totalSMSToBeSent, setTotalSMSToBeSent] = useState(0);

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
              console.log('validating step 3');
              //todo: validate totalEmailsToBeSent && totalSMSToBeSent
            }

            return errors;
          }}
        >
          {({ values, setFieldValue, errors, setErrors }) => {
            return (
              <Form className='space-y-5'>
                <div className=' text-lg font-bold'>
                  {step === 1 ? 'Create Notice' : values.title}
                </div>
                <div>
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
                              <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'>
                                Email
                              </span>
                            )}

                            {values.delivery_types.includes('sms') && (
                              <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700'>
                                {' '}
                                SMS{' '}
                              </span>
                            )}
                          </div>
                          {/* Receipient */}
                          <div>
                            <div className='mb-2 text-sm font-medium text-gray-500'>
                              Select a group:
                            </div>

                            {/* First Level */}
                            <div className='mb-6 space-x-4 text-sm'>
                              {receipients.map((type, index) => {
                                return (
                                  <button
                                    key={type.value ?? +index}
                                    disabled={
                                      !values.delivery_types.includes(
                                        'email'
                                      ) &&
                                      !values.delivery_types.includes('sms')
                                    }
                                    className={classNames(
                                      values.recipient_type === type.value
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-50 bg-slate-50 text-gray-700',
                                      'rounded border p-2 font-medium  hover:opacity-80 disabled:opacity-40'
                                    )}
                                    role='radio'
                                    aria-checked={
                                      values.recipient_type === type.value
                                    }
                                    type='button'
                                    onClick={() => {
                                      console.log('clicked', type.value);
                                      if (
                                        values.recipient_type === type.value
                                      ) {
                                        setFieldValue('recipient_type', null);
                                      } else {
                                        setFieldValue(
                                          'recipient_type',
                                          type.value
                                        );
                                      }

                                      setFieldValue('scope', '');
                                      setFieldValue('teams', []);
                                      setTotalEmailsToBeSent(0);
                                      setTotalSMSToBeSent(0);
                                    }}
                                  >
                                    {type.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Second Level: Scope Selection */}
                            <div>
                              {values.recipient_type &&
                                scopeOptions[values.recipient_type] && (
                                  <div>
                                    <div className='mb-2 mt-4 text-sm font-medium text-gray-500'>
                                      Who would you like to send this to?
                                    </div>

                                    <div className='mb-6 space-x-4 text-sm'>
                                      {scopeOptions[values.recipient_type].map(
                                        (option, index) => {
                                          return (
                                            <button
                                              key={option.value ?? +index}
                                              disabled={
                                                (!values.delivery_types.includes(
                                                  'email'
                                                ) &&
                                                  !values.delivery_types.includes(
                                                    'sms'
                                                  )) ||
                                                !totals
                                              }
                                              className={classNames(
                                                values.scope === option.value
                                                  ? 'border-primary bg-primary text-white'
                                                  : 'border-slate-50 bg-slate-50 text-gray-700',
                                                'rounded border p-2 font-medium  hover:opacity-80 disabled:opacity-40'
                                              )}
                                              role='radio'
                                              aria-checked={
                                                values.scope === option.value
                                              }
                                              type='button'
                                              onClick={() => {
                                                if (!totals) return;

                                                const checked =
                                                  values.scope === option.value;

                                                if (checked) {
                                                  setFieldValue('scope', '');
                                                } else {
                                                  setFieldValue(
                                                    'scope',
                                                    option.value
                                                  );
                                                }

                                                console.log(
                                                  'option.value',
                                                  option.value
                                                );

                                                if (
                                                  checked ||
                                                  option.value === 'specific' ||
                                                  option.value === 'roles'
                                                ) {
                                                  setTotalEmailsToBeSent(0);
                                                  setTotalSMSToBeSent(0);
                                                } else {
                                                  const recipientType =
                                                    values.recipient_type as keyof typeof totals;

                                                  const counts = totals[
                                                    recipientType
                                                  ] as any;

                                                  const total =
                                                    counts?.[
                                                      option.value ===
                                                      'global_all'
                                                        ? 'league'
                                                        : 'season'
                                                    ] || 0;

                                                  if (
                                                    values.delivery_types.includes(
                                                      'email'
                                                    )
                                                  ) {
                                                    setTotalEmailsToBeSent(
                                                      total
                                                    );
                                                  }

                                                  if (
                                                    values.delivery_types.includes(
                                                      'sms'
                                                    )
                                                  ) {
                                                    setTotalSMSToBeSent(total);
                                                  }
                                                }
                                              }}
                                            >
                                              {option.label}
                                            </button>
                                          );
                                        }
                                      )}{' '}
                                    </div>
                                  </div>
                                )}

                              {/* When hand picking recipients */}

                              <div>
                                {values.recipient_type === 'player' &&
                                  values.scope === 'specific' && (
                                    <div>show player selection dropdown</div>
                                  )}

                                {values.recipient_type === 'team' &&
                                  values.scope === 'specific' && (
                                    <div>show team selection dropdown</div>
                                  )}

                                {values.recipient_type === 'registrant' &&
                                  values.scope === 'specific' && (
                                    <div>
                                      show registrants selection dropdown
                                    </div>
                                  )}

                                {values.recipient_type === 'member' &&
                                  values.scope === 'specific' && (
                                    <div>show members selection dropdown</div>
                                  )}

                                {values.recipient_type === 'member' &&
                                  values.scope === 'roles' && (
                                    <div>show roles selection dropdown</div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* TODO: need to display indicator if exceeding remaining with group selection */}
                      <div className='mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-sm'>
                        {values.delivery_types.includes('email') && (
                          <div className='flex items-center justify-between'>
                            <span>Emails to be sent</span>{' '}
                            {credits_remaining && (
                              <span
                                className={classNames(
                                  totalEmailsToBeSent >
                                    credits_remaining.email.remaining &&
                                    'text-red-500'
                                )}
                              >{`${totalEmailsToBeSent} / ${credits_remaining.email.remaining}`}</span>
                            )}
                          </div>
                        )}

                        {values.delivery_types.includes('sms') && (
                          <div className='flex items-center justify-between'>
                            <span>Text messages to be sent</span>{' '}
                            {credits_remaining && (
                              <span
                                className={classNames(
                                  totalSMSToBeSent >
                                    credits_remaining.sms.remaining &&
                                    'text-red-500'
                                )}
                              >{`${totalSMSToBeSent} / ${credits_remaining.sms.remaining}`}</span>
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
            );
          }}
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
