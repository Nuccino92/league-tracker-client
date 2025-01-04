'use client';

import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import classNames from 'classnames';
import { z } from 'zod';
import { Switch, Popover, Combobox } from '@headlessui/react';

import FormLabel from '@/app/control-panel/_components/FormLabel';
import { Button } from '@/app/lib/components/Button';
import Modal from '@/app/lib/components/Modal';
import StyledBox from '@/app/lib/components/StyledBox';
import {
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import {
  DownChevronIcon,
  IconCheckmarkSharp,
  IconClose,
  IconPlus,
  Spinner,
} from '@/app/lib/SVGs';
import { ModalType } from '@/app/types';
import { format } from 'date-fns';
import { Calendar } from '@/app/lib/components/Calendar';
import {
  useNoticeSelectionScopeTotals,
  useNoticeStatistics,
} from '@/app/lib/hooks/api/control-panel/notices';
import useDebounce from '@/app/lib/hooks/useDebounce';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { usePlayers } from '@/app/lib/hooks/api/control-panel/players';
import { PaginationMeta } from '@/app/lib/types/pagination.types';
import { useTeams } from '@/app/lib/hooks/api/control-panel/teams';
import { useRegistrantsList } from '@/app/lib/hooks/api/control-panel/registrations';
import { useMembers } from '@/app/lib/hooks/api/control-panel/members';

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
  recipient_ids: z.array(z.number()),
  scope: z.enum(['all', 'specific', 'roles', 'global_all']).nullable(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormValueSchema>;

function CreateAnnouncementModal({ isOpen, close }: ModalType) {
  const { data, status } = useNoticeStatistics();

  const { totals, status: totalsStatus } = useNoticeSelectionScopeTotals();

  const { credits_remaining } = data || {};

  const [step, setStep] = useState(1);

  const initialValues: AnnouncementFormValues = {
    title: '',
    content: '',
    delivery_types: [],
    recipient_type: null, // 'players' or 'registrants' or 'members' or 'teams'
    recipient_ids: [],
    scope: null, // 'all', 'specific', 'roles', 'global_all'
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

  //todo: allow user to save for later or save + send

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
                                        }
                                      } else {
                                        if (type.value === 'website') {
                                          setFieldValue('delivery_types', [
                                            'website',
                                          ]);
                                          setFieldValue('recipient_type', null);
                                          setFieldValue('scope', null);
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

                                      setFieldValue('recipient_ids', []);
                                      setFieldValue('scope', null);
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

                                    <div className='mb-4 space-x-4 text-sm'>
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

                                                setFieldValue(
                                                  'recipient_ids',
                                                  []
                                                );

                                                const checked =
                                                  values.scope === option.value;

                                                if (checked) {
                                                  setFieldValue('scope', null);
                                                } else {
                                                  setFieldValue(
                                                    'scope',
                                                    option.value
                                                  );
                                                }

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
                                    <div>
                                      <SearchableList
                                        scope='global'
                                        useQueryHook={usePlayers as any}
                                        searchPlaceholder='Search for players'
                                        handeSelect={(id) => {
                                          setFieldValue('recipient_ids', [
                                            ...values.recipient_ids,
                                            id,
                                          ]);

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                        }}
                                        handleRemove={(idToRemove) => {
                                          setFieldValue(
                                            'recipient_ids',
                                            values.recipient_ids.filter(
                                              (id) => id !== idToRemove
                                            )
                                          );

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                {values.recipient_type === 'team' &&
                                  values.scope === 'specific' && (
                                    <div>
                                      <SearchableList
                                        scope='global'
                                        useQueryHook={useTeams as any}
                                        searchPlaceholder='Search for teams'
                                        handeSelect={(id) => {
                                          setFieldValue('recipient_ids', [
                                            ...values.recipient_ids,
                                            id,
                                          ]);

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                        }}
                                        handleRemove={(idToRemove) => {
                                          setFieldValue(
                                            'recipient_ids',
                                            values.recipient_ids.filter(
                                              (id) => id !== idToRemove
                                            )
                                          );

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                {values.recipient_type === 'registrant' &&
                                  values.scope === 'specific' && (
                                    <div>
                                      <SearchableList
                                        scope='currentSeason'
                                        useQueryHook={useRegistrantsList as any}
                                        searchPlaceholder='Search for registrants'
                                        handeSelect={(id) => {
                                          setFieldValue('recipient_ids', [
                                            ...values.recipient_ids,
                                            id,
                                          ]);

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                        }}
                                        handleRemove={(idToRemove) => {
                                          setFieldValue(
                                            'recipient_ids',
                                            values.recipient_ids.filter(
                                              (id) => id !== idToRemove
                                            )
                                          );

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                {values.recipient_type === 'member' &&
                                  values.scope === 'specific' && (
                                    <div>
                                      <SearchableList
                                        scope='global'
                                        useQueryHook={useMembers as any}
                                        searchPlaceholder='Search for members'
                                        handeSelect={(id) => {
                                          setFieldValue('recipient_ids', [
                                            ...values.recipient_ids,
                                            id,
                                          ]);

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev + 1
                                            );
                                          }
                                        }}
                                        handleRemove={(idToRemove) => {
                                          setFieldValue(
                                            'recipient_ids',
                                            values.recipient_ids.filter(
                                              (id) => id !== idToRemove
                                            )
                                          );

                                          if (
                                            values.delivery_types.includes(
                                              'email'
                                            )
                                          ) {
                                            setTotalEmailsToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                          if (
                                            values.delivery_types.includes(
                                              'sms'
                                            )
                                          ) {
                                            setTotalSMSToBeSent(
                                              (prev) => prev - 1
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  )}

                                {values.recipient_type === 'member' &&
                                  values.scope === 'roles' && (
                                    <div>
                                      come back to this once the members page is
                                      fleshed out and roles are thought of.{' '}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}

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
                        setFieldValue('recipient_ids', []);
                        setFieldValue('recipient_type', null);
                        setFieldValue('scope', null);
                        setTotalEmailsToBeSent(0);
                        setTotalSMSToBeSent(0);
                      }}
                      className='border-0 bg-slate-50 !text-black hover:bg-slate-100 disabled:opacity-40'
                    >
                      Previous
                    </Button>
                  ) : (
                    <span />
                  )}

                  <Button
                    type='submit'
                    disabled={
                      (step === 2 && values.delivery_types.length === 0) ||
                      (step === 3 &&
                        getIsDisabledStep3(
                          values,
                          {
                            email: credits_remaining?.email.total ?? 0,
                            sms: credits_remaining?.sms.total ?? 0,
                          },
                          totals
                        ))
                    }
                  >
                    {' '}
                    {step === 1 && 'Next'}{' '}
                    {step === 2 &&
                      values.delivery_types.includes('website') &&
                      'Post'}
                    {step === 2 &&
                      values.delivery_types.length === 0 &&
                      'Select Option'}
                    {step === 2 &&
                    (values.delivery_types.includes('email') ||
                      values.delivery_types.includes('sms'))
                      ? 'Select Group'
                      : ''}
                    {step === 3 && 'Send Notice'}
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

interface Item {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface SearchableListProps {
  scope: string;
  useQueryHook: (params: {
    givenParams: string;
    paginate?: boolean;
    enabled?: boolean;
  }) => {
    response: {
      data: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
      }> | null;
      meta: PaginationMeta | null;
    };
    status: 'loading' | 'error' | 'success';
    isInitialLoading: boolean;
  };
  searchPlaceholder: string;

  handeSelect: (id: number) => void;
  handleRemove: (id: number) => void;
}

function SearchableList({
  scope,
  useQueryHook,
  searchPlaceholder,
  handeSelect,
  handleRemove,
}: SearchableListProps) {
  const [selected, setSelected] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 750);

  const { activeSeason } = useLeagueControlPanel();
  const params = `${debouncedSearch.length >= 3 ? `search=${debouncedSearch}` : ''}${
    scope === 'currentSeason' && activeSeason
      ? `${debouncedSearch.length >= 3 ? '&' : ''}season=${activeSeason.id}`
      : ''
  }`;
  const hasSearchedForItem = query.length >= 3 && debouncedSearch.length >= 3;

  const { response, status, isInitialLoading } = useQueryHook({
    givenParams: params,
    paginate: false,
    enabled: hasSearchedForItem,
  });

  const removeItem = (itemToRemove: Item) => {
    setSelected(selected.filter((item) => item.id !== itemToRemove.id));

    handleRemove(itemToRemove.id);
  };

  const handleSelect = (item: Item) => {
    if (!selected.find((selectedItem) => selectedItem.id === item.id)) {
      setSelected([...selected, item]);
    }
    setQuery('');

    handeSelect(item.id);
  };

  return (
    <div className='space-y-2'>
      <Combobox value={null} onChange={handleSelect}>
        <div className='relative'>
          <div className='relative w-full'>
            <Combobox.Button className='w-full'>
              <Combobox.Input
                className='w-full rounded-md border p-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary'
                displayValue={() => query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
              />
              <span className='absolute inset-y-0 right-0 flex items-center pr-2'>
                <DownChevronIcon
                  height={14}
                  width={14}
                  className='text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Combobox.Button>
          </div>

          <Combobox.Options
            className={classNames(
              !hasSearchedForItem ? '!hidden' : '',
              'swatches-picker absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
            )}
          >
            {status === 'success' &&
              hasSearchedForItem &&
              response.data?.length === 0 && (
                <div className='relative px-4 py-2 text-sm text-gray-500'>
                  Nothing found.
                </div>
              )}

            {isInitialLoading && (
              <div className='flex justify-center py-8'>
                <Spinner height={24} width={24} />
              </div>
            )}

            {status === 'success' &&
              response.data?.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-pointer select-none px-4 py-2',
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    )
                  }
                >
                  {({ active }) => (
                    <div className='flex items-center justify-between'>
                      <span className='block truncate'>
                        {item.name ?? item.email}{' '}
                        {item.role && (
                          <span className='ml-3 text-xs'>({item.role})</span>
                        )}
                      </span>
                      {selected.find(
                        (selectedItem) => selectedItem.id === item.id
                      ) && (
                        <IconCheckmarkSharp
                          className={active ? 'text-white' : 'text-secondary'}
                          height={20}
                          width={20}
                        />
                      )}
                    </div>
                  )}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </div>
      </Combobox>

      {/* Selected items tags */}
      {selected.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selected.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-sm text-blue-700'
            >
              <span>{item.name ?? item.email}</span>
              <button
                onClick={() => removeItem(item)}
                className='ml-1 rounded-full p-0.5 hover:bg-blue-200'
              >
                <IconClose />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getIsDisabledStep3(
  values: AnnouncementFormValues,
  credits: { email: number; sms: number },
  totals: any
) {
  if (!values.recipient_type || !values.scope) return true;

  if (values.scope === 'specific' && values.recipient_ids.length === 0)
    return true;

  // Get total recipients based on scope
  const totalRecipients = // Need to incorporate member roles
    values.scope === 'specific'
      ? values.recipient_ids.length
      : totals[values.recipient_type]?.[
          values.scope === 'global_all' ? 'league' : 'season'
        ] || 0;

  // Check if exceeds email credits
  if (
    values.delivery_types.includes('email') &&
    totalRecipients > credits.email
  )
    return true;

  // Check if exceeds SMS credits
  if (values.delivery_types.includes('sms') && totalRecipients > credits.sms)
    return true;

  return false;
}
