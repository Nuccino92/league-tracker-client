'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { z } from 'zod';
import Image from 'next/image';

import {
  DeleteIcon,
  IconCaretLeft,
  IconCaretRight,
  IconCheckmarkCircleOutline,
  Spinner,
} from '@/app/lib/SVGs';
import { DefaultColors } from '@/app/lib/enums';
import { INPUT_CLASSES } from '@/app/lib/globals/styles';
import FileUpload from '@/app/lib/components/FileUpload';
import ColorPicker from '@/app/lib/components/ColorPicker';
import { Button } from '@/app/lib/components/Button';
import {
  useCreateLeague,
  useCreateLeagueSports,
} from '@/app/lib/hooks/api/league';
import { SportType } from '@/app/lib/types/sport.types';
import { StatType } from '@/app/lib/types/Responses/create-league-types';
import { useIsFreeTrialAvailable } from '@/app/GlobalContext';
import SubscriptionCard from './SubscriptionCard';
import { useGetSubscriptionPlans } from '@/app/lib/hooks/api/billing';
import { getMonthlyPriceInAnnualPlan } from '@/app/lib/utils/subscriptionHelpers';
import BillingToggle from '@/app/create/_components/BillingToggle';

type Step = {
  id: number;
  label: string;
  field: string;
  navLabels: string;
  isCompleted: boolean;
  required: boolean;
};

export default function CreationSetup() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      label: 'What is your league name?',
      navLabels: 'Name',
      field: 'name',
      isCompleted: false,
      required: true,
    },
    {
      id: 2,
      label: 'Give a description of your league',
      navLabels: 'Description',
      field: 'description',
      isCompleted: false,
      required: false,
    },
    {
      id: 3,
      label: 'League Logo',
      navLabels: 'Logo',
      field: 'logo',
      isCompleted: false,
      required: false,
    },
    {
      id: 4,
      label: 'Select your league colors',
      navLabels: 'Colors',
      field: 'colors',
      isCompleted: false,
      required: false,
    },
    {
      id: 5,
      label: 'Sport Selection',
      navLabels: 'Sport',
      field: 'sport',
      isCompleted: false,
      required: true,
    },
    {
      id: 6,
      label: 'Stats Selection',
      navLabels: 'Stats',
      field: 'selected_stats',
      isCompleted: false,
      required: false,
    },
    {
      id: 7,
      label: 'Payment',
      navLabels: 'Billing',
      field: 'payment',
      isCompleted: false,
      required: true,
    },
  ]);

  const isFreeTrialAvailable = useIsFreeTrialAvailable();

  const [canAccessPayment, setCanAccessPayment] = useState(false);
  const [showFreeTrialMessage, setShowFreeTrialMessage] = useState(
    isFreeTrialAvailable ? true : false
  );
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(
    isFreeTrialAvailable ? false : true
  );

  const [showStripePayments, setShowStripePayments] = useState(false);

  const { sports, status } = useCreateLeagueSports();
  const { data, status: plansStatus } = useGetSubscriptionPlans();

  const createLeagueMutation = useCreateLeague();

  /**
   * 
   * when picking a subscription
   * 
   *    await createLeagueMutation.mutateAsync({
         formData: leagueInformation as LeagueInformationResource,
         subscription: {
           payment_method_id: payment_method,
           product_id: stripeProductID,
           price_id: stripePaymentID,
         },
       });
    *
   */

  const markStepAsVisited = (stepId: number) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, isCompleted: true } : step
      )
    );
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 7 && !canAccessPayment) return;
    setCurrentStep(stepId);
  };

  interface FormValues {
    name: string;
    logo: string;
    description: string;
    primary_color: string;
    secondary_color: string;
    sport: string | null;
    selected_stats: number[];
    selected_plan: string | null;
    selected_billing: 'monthly' | 'yearly';
  }

  const initialValues: FormValues = {
    name: '',
    logo: '',
    description: '',
    primary_color: DefaultColors.Primary,
    secondary_color: DefaultColors.Secondary,
    sport: null,
    selected_stats: [],
    selected_plan: null,
    selected_billing: 'monthly',
  };

  const currentQuestion = steps[currentStep - 1];

  return (
    <div className='flex h-full bg-slate-50'>
      <ProgressBar
        currentStep={currentStep - 1}
        totalSteps={steps.length - 1}
      />

      {/* Main Content */}
      <div className='flex flex-1 items-center justify-center pl-2 sm:pl-6 lg:p-6'>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            // must map over the sports stats and include the locked at of the selected sport!!! :)
            console.log('Form submitted!:', values);

            setCanAccessPayment(true);
            setCurrentStep(currentStep + 1);
          }}
          validate={(values) => {
            const errors: Partial<FormValues> = {};

            if (currentStep === 6) {
              const nameError = validateField('name', values.name);
              const sportError = validateField('sport', values.sport);

              if (nameError) {
                errors['name'] = nameError;
              }
              if (sportError) {
                errors['sport'] = sportError;
              }

              return errors;
            }

            const currentField = currentQuestion.field as keyof FormValues;
            const error = validateField(currentField, values[currentField]);

            if (error) {
              errors[currentField] = error as any;
            }
            return errors;
          }}
        >
          {({
            errors,
            setFieldError,
            touched,
            validateForm,
            setTouched,
            values,
            setFieldValue,
          }) => (
            <Form className='flex w-full flex-col justify-between space-y-6 rounded-xl bg-white p-4 shadow sm:p-6 lg:w-[700px]'>
              <QuestionLabel
                text={currentQuestion.label}
                required={currentQuestion.required}
              />

              <div className='space-y-4'>
                {currentStep === 1 && (
                  <div>
                    <Field
                      name={currentQuestion.field}
                      className={classNames('bg-slate-50', INPUT_CLASSES)}
                      placeholder='Enter your league name...'
                      autoFocus
                      onChange={(e: any) => {
                        const value = e.target.value;

                        setFieldValue('name', value);

                        if (value.length < 5) {
                          setCanAccessPayment(false);
                        }
                        if (value.length > 5 && values.sport) {
                          setCanAccessPayment(true);
                        }
                      }}
                    />
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <Field
                      name={currentQuestion.field}
                      className={classNames(
                        'swatches-picker h-[225px] resize-none bg-slate-50 py-2',
                        INPUT_CLASSES
                      )}
                      as='textarea'
                      placeholder='Enter your league description...'
                      autoFocus
                    />
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <div className='flex'>
                      {values.logo ? (
                        <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
                          <Image
                            src={values.logo}
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

                              setFieldValue('logo', null);
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
                          classnames='!bg-slate-50'
                          changeEvent={(value) => {
                            if (errors['logo']) {
                              setFieldError('logo', '');
                            }
                            setFieldValue('logo', value);
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className='space-y-6'>
                    <div className=''>
                      <div className='mb-2 text-sm font-medium'>
                        Primary color
                      </div>
                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={values.primary_color ?? '#00337C'}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            setFieldValue('primary_color', color)
                          }
                        />
                        {values.primary_color !== '#00337C' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              setFieldValue('primary_color', '#00337C')
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>

                      {errors['primary_color'] ? (
                        <div className='text-sm text-red-500'>
                          {errors['primary_color']}
                        </div>
                      ) : null}
                    </div>
                    <div className=''>
                      <div className='mb-2 text-sm font-medium'>
                        Secondary color
                      </div>

                      <div className='flex items-center space-x-3'>
                        <ColorPicker
                          color={values.secondary_color ?? '#03C988'}
                          buttonClasses='w-[100px]'
                          saveColor={(color: string) =>
                            setFieldValue('secondary_color', color)
                          }
                        />
                        {values.secondary_color !== '#03C988' ? (
                          <button
                            type='button'
                            className='text-s, h-10 rounded bg-red-500 px-2 text-sm font-medium text-white ring-secondary transition-all duration-100 hover:ring-1'
                            onClick={() =>
                              setFieldValue('secondary_color', '#03C988')
                            }
                          >
                            Reset to Default
                          </button>
                        ) : null}
                      </div>

                      {errors['secondary_color'] ? (
                        <div className='text-sm text-red-500'>
                          {errors['secondary_color']}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div>
                    {sports && status === 'success' && (
                      <div className='grid grid-cols-2 gap-6'>
                        {Object.entries(sports).map(([key, sport]) => {
                          const selected = values.sport === sport.info.value;
                          return (
                            <button
                              type='button'
                              onClick={() => {
                                setFieldValue('sport', sport.info.value);
                                setFieldValue('selected_stats', []);
                              }}
                              key={sport.info.value}
                              className={classNames(
                                selected
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-black',
                                'flex w-full items-center justify-center gap-2 rounded border p-3 text-sm font-medium shadow'
                              )}
                            >
                              <span>{getSportsIcon(key as any)}</span>{' '}
                              {sport.info.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {status === 'loading' && (
                      <div className='flex items-center justify-center py-6'>
                        <Spinner height={34} width={34} />
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 6 && (
                  <div className='text-sm'>
                    {values.sport && sports && (
                      <div>
                        <div className='mb-1 text-lg font-medium capitalize'>
                          {values.sport}
                        </div>

                        <div className='mb-6 space-y-2 text-sm text-gray-600'>
                          <p>
                            Select the statistics you want to track for this
                            league. These stats will need to be entered after
                            each game.
                          </p>
                          <ul className='list-disc space-y-1 pl-4'>
                            <li>
                              Locked stats (marked with 🔒) are mandatory and
                              cannot be disabled
                            </li>
                            <li>
                              Additional stats can be enabled/disabled based on
                              your league&apos;s needs
                            </li>
                            <li>
                              Position-specific stats are grouped into
                              categories
                            </li>
                          </ul>
                          <p className='mt-4 italic'>
                            Tip: Select stats that are easy to track during
                            games and relevant to your league level.
                          </p>
                        </div>

                        <div>
                          {sports[values.sport].stat_categories ? (
                            <div className='grid grid-cols-2 gap-4'>
                              {sports[values.sport].stat_categories?.map(
                                (category) => {
                                  return (
                                    <div key={category}>
                                      <div className='mb-1 capitalize'>
                                        {category}
                                      </div>

                                      <div className='grid grid-cols-3 gap-2'>
                                        {values.sport &&
                                          [...sports[values.sport].stats]
                                            .filter(
                                              (stat) =>
                                                stat.category === category ||
                                                stat.category === null ||
                                                stat.category === undefined
                                            )
                                            .sort((a, b) => {
                                              if (a.is_locked && !b.is_locked)
                                                return -1;
                                              if (!a.is_locked && b.is_locked)
                                                return 1;
                                              return a.name.localeCompare(
                                                b.name
                                              );
                                            })
                                            .map((stat) => {
                                              return (
                                                <Stat
                                                  stat={stat}
                                                  key={stat.name}
                                                  onClick={() => {
                                                    if (
                                                      values.selected_stats.includes(
                                                        stat.id
                                                      )
                                                    ) {
                                                      setFieldValue(
                                                        'selected_stats',
                                                        values.selected_stats.filter(
                                                          (selected) =>
                                                            selected !== stat.id
                                                        )
                                                      );
                                                    } else {
                                                      setFieldValue(
                                                        'selected_stats',
                                                        [
                                                          ...values.selected_stats,
                                                          stat.id,
                                                        ]
                                                      );
                                                    }
                                                  }}
                                                  selected={values.selected_stats.includes(
                                                    stat.id
                                                  )}
                                                />
                                              );
                                            })}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <div className='grid grid-cols-4 gap-4'>
                              {[...sports[values.sport].stats]
                                .sort((a, b) => {
                                  if (a.is_locked && !b.is_locked) return -1;
                                  if (!a.is_locked && b.is_locked) return 1;

                                  return a.name.localeCompare(b.name);
                                })
                                .map((stat) => {
                                  return (
                                    <Stat
                                      stat={stat}
                                      key={stat.name}
                                      onClick={() => {
                                        if (
                                          values.selected_stats.includes(
                                            stat.id
                                          )
                                        ) {
                                          setFieldValue(
                                            'selected_stats',
                                            values.selected_stats.filter(
                                              (selected) => selected !== stat.id
                                            )
                                          );
                                        } else {
                                          setFieldValue('selected_stats', [
                                            ...values.selected_stats,
                                            stat.id,
                                          ]);
                                        }
                                      }}
                                      selected={values.selected_stats.includes(
                                        stat.id
                                      )}
                                    />
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {!values.sport && (
                      <div>
                        <div>You must first select a sport</div>
                      </div>
                    )}
                    {status === 'loading' && (
                      <div className='flex items-center justify-center py-6'>
                        <Spinner height={34} width={34} />
                      </div>
                    )}

                    <div className='mt-2'>
                      {errors['name'] && (
                        <div className='text-sm text-red-500'>
                          Please provide a league name in step 1
                        </div>
                      )}
                      {errors['sport'] && (
                        <div className='text-sm text-red-500'>
                          Please select a sport name in step 5
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Billing step */}
                {currentStep === 7 && (
                  <div>
                    {/* Free trial message */}
                    {isFreeTrialAvailable && showFreeTrialMessage && (
                      <div className='font-medium text-gray-600 sm:w-1/2'>
                        You have access to our 14 day free trial. Would you like
                        to active it?
                      </div>
                    )}

                    {/* Subscription plans */}
                    {showSubscriptionPlans && (
                      <div>
                        {plansStatus === 'loading' && (
                          <div className='flex items-center justify-center py-6'>
                            <Spinner height={34} width={34} />
                          </div>
                        )}
                        {data && status === 'success' && (
                          <div className='space-y-6'>
                            <BillingToggle
                              billingPeriod={values.selected_billing}
                              onChange={(period) =>
                                setFieldValue('selected_billing', period)
                              }
                            />
                            <div className='flex flex-col gap-4 sm:flex-row'>
                              {data.plans.map((plan) => (
                                <div
                                  role='button'
                                  key={plan.id}
                                  onClick={() =>
                                    setFieldValue('selected_plan', plan.id)
                                  }
                                >
                                  <SubscriptionCard
                                    title={plan.title}
                                    price={
                                      values.selected_billing === 'monthly'
                                        ? plan.pricing.monthly
                                        : getMonthlyPriceInAnnualPlan(plan)
                                    }
                                    features={plan.features.map(
                                      (f) => f.description
                                    )}
                                    highlight={values.selected_plan === plan.id}
                                  />{' '}
                                </div>
                              ))}{' '}
                            </div>
                          </div>
                        )}{' '}
                      </div>
                    )}

                    {/* Checkout */}
                    {showStripePayments && <div>showing stripe payments</div>}
                  </div>
                )}

                {errors[currentQuestion.field as keyof FormValues] &&
                  touched[currentQuestion.field as keyof FormValues] && (
                    <div className='text-sm text-red-500'>
                      {errors[currentQuestion.field as keyof FormValues]}
                    </div>
                  )}
              </div>

              <div className='flex justify-between space-x-4'>
                <button
                  disabled={currentStep === 1}
                  type='button'
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                  className='rounded-md text-sm font-medium text-gray-700 disabled:opacity-25 sm:h-9 sm:bg-gray-100 sm:px-4 sm:py-2 hover:sm:bg-gray-200'
                >
                  <span className='hidden sm:block'>Previous</span>
                  <span className='sm:hidden '>
                    {' '}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
                      />
                    </svg>
                  </span>
                </button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    className='rounded-md text-sm'
                    onClick={async (e) => {
                      e.preventDefault();
                      // Mark the current field as touched to trigger validation
                      await setTouched({
                        [currentQuestion.field]: true,
                      });
                      // Validate the form
                      const errors = await validateForm();
                      // Check if there are any errors for the current field
                      const hasErrors =
                        errors[currentQuestion.field as keyof FormValues];
                      if (!hasErrors) {
                        setCurrentStep(currentStep + 1);
                        markStepAsVisited(currentQuestion.id);
                      }

                      if (hasErrors) {
                        setSteps(
                          steps.map((step) =>
                            step.id === currentQuestion.id
                              ? { ...step, isCompleted: false }
                              : step
                          )
                        );
                      }
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <>
                    {currentStep === 6 && (
                      <button
                        // proceed to step 7 with the payment stuff
                        onClick={() => markStepAsVisited(currentQuestion.id)}
                        type='submit'
                        className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50'
                      >
                        Proceed to billing
                      </button>
                    )}

                    {currentQuestion.field === 'payment' &&
                      isFreeTrialAvailable &&
                      showFreeTrialMessage && (
                        <div className='space-x-2'>
                          <Button
                            variant={'secondary'}
                            type='button'
                            onClick={() => {
                              //TODO: call mutation function to create the league
                              //createLeagueMutation
                            }}
                          >
                            Use free trial
                          </Button>

                          <Button
                            type='button'
                            onClick={() => {
                              setShowSubscriptionPlans(true);
                              setShowFreeTrialMessage(false);
                            }}
                          >
                            Continue to plans
                          </Button>
                        </div>
                      )}

                    {currentQuestion.field === 'payment' &&
                      showSubscriptionPlans && (
                        <div className='space-x-2'>
                          {isFreeTrialAvailable && (
                            <Button
                              variant={'ghost'}
                              className='!p-2 text-gray-500 hover:text-secondary sm:!p-4'
                              type='button'
                              onClick={() => {
                                //TODO: call mutation function to create the league
                                //createLeagueMutation
                              }}
                            >
                              <span className='hidden sm:block'>
                                {' '}
                                Activate free trial
                              </span>
                              <span className='sm:hidden'> Activate trial</span>
                            </Button>
                          )}

                          <Button
                            disabled={values.selected_plan ? false : true}
                            variant={'secondary'}
                            type='button'
                            onClick={() => {
                              setShowSubscriptionPlans(false);
                              setShowStripePayments(true);
                            }}
                          >
                            Proceed to payment
                          </Button>
                        </div>
                      )}

                    {currentQuestion.field === 'payment' &&
                      showStripePayments && (
                        <div className='space-x-3 sm:space-x-4'>
                          {isFreeTrialAvailable && (
                            <Button
                              variant={'ghost'}
                              className='!p-2 text-gray-500 hover:text-secondary sm:!p-4'
                              type='button'
                              onClick={() => {
                                //TODO: call mutation function to create the league
                                //createLeagueMutation
                              }}
                            >
                              <span className='hidden sm:block'>
                                {' '}
                                Activate free trial
                              </span>
                              <span className='sm:hidden'> Activate trial</span>
                            </Button>
                          )}

                          <Button
                            className='bg-transparent !p-1 font-medium !text-primary !shadow-none sm:bg-primary sm:!p-4 sm:!text-white sm:!shadow-sm'
                            type='button'
                            onClick={() => {
                              setShowSubscriptionPlans(true);
                              setShowStripePayments(false);
                            }}
                          >
                            Plans
                          </Button>

                          <Button
                            variant={'secondary'}
                            type='button'
                            onClick={() => {
                              setShowSubscriptionPlans(false);
                              setShowStripePayments(true);
                            }}
                          >
                            Checkout
                          </Button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Side Navigation */}
      <div className='relative m-1 flex items-center justify-center sm:m-6 sm:h-[calc(100vh-130px)] sm:min-w-14'>
        <SideNavigation
          isNavCollapsed={isNavCollapsed}
          setIsNavCollapsed={setIsNavCollapsed}
          steps={steps}
          handleStepClick={handleStepClick}
          currentStep={currentStep}
          canAccessPayment={canAccessPayment}
        />
      </div>
    </div>
  );
}

type SideNavigationProps = {
  isNavCollapsed: boolean;
  setIsNavCollapsed: Dispatch<SetStateAction<boolean>>;
  steps: Step[];
  handleStepClick: (id: number) => void;
  currentStep: number;
  canAccessPayment: boolean;
};

function SideNavigation({
  isNavCollapsed,
  setIsNavCollapsed,
  steps,
  handleStepClick,
  currentStep,
  canAccessPayment,
}: SideNavigationProps) {
  return (
    <>
      <div
        className={classNames(
          isNavCollapsed
            ? 'sm:h-[calc(100vh-130px)] sm:w-14'
            : 'h-[calc(100vh-130px)] w-64',
          'absolute right-0 top-0 z-10 rounded-xl border bg-white text-sm shadow transition-all duration-200 ease-in-out sm:top-auto xl:relative'
        )}
      >
        <div
          className={classNames(
            isNavCollapsed ? ' justify-center p-2' : 'justify-between p-4',
            'flex items-center border-b  transition-opacity duration-75'
          )}
        >
          <span
            className={classNames(
              isNavCollapsed ? 'opacity-0 sm:hidden' : 'opacity-100',
              'font-medium transition-all duration-75 '
            )}
          >
            Progress
          </span>
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className={classNames(
              isNavCollapsed
                ? '!flex h-10 w-10 min-w-[40px] !items-center !justify-center !text-center'
                : '',
              'rounded p-1 hover:bg-gray-100'
            )}
          >
            {isNavCollapsed ? (
              <IconCaretLeft height={18} width={18} />
            ) : (
              <IconCaretRight height={18} width={18} />
            )}
          </button>
        </div>

        <div
          className={classNames(isNavCollapsed ? 'hidden' : '', 'p-2 sm:block')}
        >
          {steps.map((step) => {
            return (
              <div key={step.id}>
                {step.field === 'payment' && (
                  <hr className='my-3 w-full border' />
                )}
                <button
                  disabled={step.field === 'payment' && !canAccessPayment}
                  onClick={() => handleStepClick(step.id)}
                  className={classNames(
                    'mb-1 w-full rounded p-2 !text-left disabled:opacity-50',
                    step.id === currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-gray-50',
                    isNavCollapsed &&
                      '!flex h-10 w-10 min-w-[40px] !items-center !justify-center !text-center'
                  )}
                >
                  <div
                    className={classNames(
                      isNavCollapsed && 'justify-center',
                      'flex items-center text-center'
                    )}
                  >
                    <div
                      className={classNames(
                        'flex items-center justify-center rounded',
                        step.isCompleted && !isNavCollapsed
                          ? 'bg-secondary text-white'
                          : step.id === currentStep && !isNavCollapsed
                            ? 'bg-primary text-white'
                            : 'bg-gray-200',
                        isNavCollapsed ? '!bg-transparent' : 'mr-2 h-6 w-6'
                      )}
                    >
                      {step.isCompleted ? (
                        <IconCheckmarkCircleOutline
                          width={20}
                          height={20}
                          color={isNavCollapsed ? 'rgb(3 201 13)' : 'white'}
                        />
                      ) : (
                        step.id
                      )}
                    </div>
                    {!isNavCollapsed && (
                      <span className='truncate'>{step.navLabels}</span>
                    )}
                  </div>
                </button>{' '}
              </div>
            );
          })}
        </div>
      </div>{' '}
      <div
        onClick={() => setIsNavCollapsed(true)}
        className={classNames(
          !isNavCollapsed
            ? 'fixed bottom-0 left-0 h-[calc(100vh-80px)] w-screen bg-black/10'
            : '',
          'xl:!hidden'
        )}
      />
    </>
  );
}

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className='fixed left-0 top-0  mt-[80px] w-full bg-slate-50'>
      <div className='h-1'>
        <div
          className='h-full bg-secondary transition-all duration-300 ease-in-out'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

function QuestionLabel({
  text,
  required = false,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <div className='space-x-1 text-2xl font-bold'>
      <span>{text}</span>
      {required && <span className='text-red-500'>*</span>}
    </div>
  );
}

const validateField = (fieldName: string, value: any): string | undefined => {
  switch (fieldName) {
    case 'name':
      if (!value) return 'The league name is required';
      if (value.length < 5) return 'League name must be at least 5 characters';
      if (value.length > 50) return 'Length must not exceed 50 characters';
      break;
    case 'logo':
      if (value) {
        try {
          new URL(value);
          if (value.length < 5) return 'URL must be at least 5 characters';
          if (value.length > 255) return 'URL must not exceed 255 characters';
        } catch {
          return 'The logo must be a URL';
        }
      }
      break;
    case 'description':
      if (value) {
        if (value.length > 300)
          return 'Description must not exceed 300 characters';
        if (value.length > 0 && value.length < 20)
          return 'Description must be at least 20 characters if provided';
      }
      break;
    case 'primary_color':
      if (!value) return 'Required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Must be a hex color code';
      break;
    case 'secondary_color':
      if (!value) return 'Required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) return 'Must be a hex color code';
      break;
    case 'sport':
      if (!value) return 'A sport selection is required';
      break;
  }
};

function getSportsIcon(sport: SportType) {
  switch (sport) {
    case 'basketball':
      return (
        <svg viewBox='0 0 512 512' fill='currentColor' height='1em' width='1em'>
          <path d='M86.6 64c32.4-28.5 72-49 115.7-58.4C206 19.1 208 33.3 208 48c0 38.4-13.5 73.7-36.1 101.3L86.6 64zM64 86.6l85.2 85.2C121.7 194.5 86.4 208 48 208c-14.7 0-28.9-2-42.4-5.7C15 158.6 35.5 119 64 86.6zM256 0c64.9 0 124.2 24.2 169.4 64L256 233.4 194.6 172C222.9 138.5 240 95.3 240 48c0-16.2-2-32-5.8-47.1A263 263 0 01256 0zM48 240c47.3 0 90.5-17.1 124-45.4l61.4 61.4L64 425.4C24.2 380.2 0 320.9 0 256c0-7.3.3-14.6.9-21.8C16 238 31.8 240 48 240zm463.1 37.8C496 274 480.2 272 464 272c-47.3 0-90.5 17.1-124 45.4L278.6 256 448 86.6c39.8 45.1 64 104.4 64 169.4 0 7.3-.3 14.6-.9 21.8zm-4.7 31.9C497 353.4 476.5 393 448 425.4l-85.2-85.2C390.3 317.5 425.6 304 464 304c14.7 0 28.9 2 42.4 5.7zm-166.3 53l85.3 85.3c-32.4 28.5-72 49-115.7 58.4-3.7-13.5-5.7-27.7-5.7-42.4 0-38.4 13.5-73.7 36.1-101.3zM317.4 340c-28.3 33.5-45.4 76.7-45.4 124 0 16.2 2 32 5.8 47.1-7.2.6-14.5.9-21.8.9-64.9 0-124.2-24.2-169.4-64L256 278.6l61.4 61.4z' />
        </svg>
      );
    case 'baseball':
      return (
        <svg
          viewBox='0 0 640 512'
          fill='currentColor'
          height='1.1em'
          width='1.1em'
        >
          <path d='M550.3 0c-10.9 0-21.4 3.4-30.2 9.8L279.7 184.6c-13.9 10.1-26.8 21.4-38.7 33.8L138.7 325.3c-9.2 9.6-19.3 18.4-30.1 26.3l-29.3 21.3c1.3 1.5 2.6 3 3.9 4.7l48 64c1.6 2.2 3.1 4.4 4.4 6.6l27.3-19.9c11.6-8.4 24-15.8 37-21.8l135.3-63.1c16.7-7.8 32.7-17.2 47.6-28.1L619 143.6c13.2-9.6 21-24.9 21-41.2 0-11-3.6-21.8-10.2-30.6l-20.2-27-18.2-24.2C581.7 7.6 566.5 0 550.3 0zM496 512c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80zM57.6 396.8c-10.6-14.1-30.7-17-44.8-6.4s-17 30.7-6.4 44.8l48 64c10.6 14.1 30.7 17 44.8 6.4s17-30.7 6.4-44.8l-48-64z' />
        </svg>
      );
    case 'soccer':
      return (
        <svg
          viewBox='0 0 24 24'
          fill='currentColor'
          height='1.4em'
          width='1.4em'
        >
          <path d='M16.93 17.12l-.8-1.36 1.46-4.37 1.41-.47 1 .75v.14c0 .07.03.13.03.19 0 1.97-.66 3.71-1.97 5.21l-1.13-.09M9.75 15l-1.37-4.03L12 8.43l3.62 2.54L14.25 15h-4.5M12 20.03c-.88 0-1.71-.14-2.5-.42l-.69-1.51.66-1.1h5.11l.61 1.1-.69 1.51c-.79.28-1.62.42-2.5.42m-6.06-2.82c-.53-.62-.99-1.45-1.38-2.46-.39-1.02-.59-1.94-.59-2.75 0-.06.03-.12.03-.19v-.14l1-.75 1.41.47 1.46 4.37-.8 1.36-1.13.09M11 5.29v1.4L7 9.46l-1.34-.42-.42-1.36C5.68 7 6.33 6.32 7.19 5.66s1.68-1.09 2.46-1.31l1.35.94m3.35-.94c.78.22 1.6.65 2.46 1.31.86.66 1.51 1.34 1.95 2.02l-.42 1.36-1.34.43-4-2.77V5.29l1.35-.94m-9.42.58C3 6.89 2 9.25 2 12s1 5.11 2.93 7.07S9.25 22 12 22s5.11-1 7.07-2.93S22 14.75 22 12s-1-5.11-2.93-7.07S14.75 2 12 2 6.89 3 4.93 4.93z' />
        </svg>
      );
    case 'hockey':
      return (
        <svg viewBox='0 0 512 512' fill='currentColor' height='1em' width='1em'>
          <path d='M256 256C114.6 256 0 213 0 160s114.6-96 256-96 256 43 256 96-114.6 96-256 96zm192.3 1.8c24.7-9.3 46.9-21 63.7-35.6V352c0 53-114.6 96-256 96S0 405 0 352V222.3c16.8 14.6 39 26.3 63.7 35.6 50.8 19 118.8 30.1 192.3 30.1s141.5-11.1 192.3-30.2z' />
        </svg>
      );
    case 'football':
      return (
        <svg viewBox='0 0 512 512' fill='currentColor' height='1em' width='1em'>
          <path d='M247.5 25.4c-13.5 3.3-26.4 7.2-38.6 11.7-66 24.5-112.2 66.5-142.9 116.5-18.3 29.8-30.9 62.3-39.2 95.4l237.7 237.6c13.5-3.3 26.4-7.2 38.6-11.7 66-24.5 112.2-66.5 142.9-116.5 18.3-29.8 30.9-62.3 39.1-95.3L247.5 25.4zm247.7 179.9c6.1-56.8 1.4-112.2-7.7-156.4-2.7-12.9-13-22.9-26.1-25.1-58.2-9.7-109.9-12-155.6-7.9l189.4 189.4zM206.1 496L16.8 306.7c-6.1 56.8-1.4 112.2 7.7 156.4 2.7 12.9 13 22.9 26.1 25.1 58.2 9.7 109.9 12 155.6 7.9zm54.6-331.3c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6zm-48 48c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6zm-48 48c6.2-6.2 16.4-6.2 22.6 0l64 64c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0l-64-64c-6.2-6.2-6.2-16.4 0-22.6z' />
        </svg>
      );
  }
}

function Stat({
  stat,
  onClick,
  selected,
}: {
  stat: StatType;
  onClick: () => void;
  selected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={stat.is_locked}
      type='button'
      onClick={onClick}
      className={classNames(
        stat.is_locked
          ? 'border-gray-400 !bg-primary text-white hover:!border-gray-400'
          : 'border-black',
        selected ? 'bg-primary text-white' : 'bg-white text-black',
        'relative flex h-full w-full items-center justify-center rounded-md border border-black py-3 font-medium hover:border-secondary'
      )}
    >
      {stat.code}

      {stat.is_locked && !isHovered && (
        <span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='absolute inset-0 z-10 flex items-start justify-start rounded-md bg-gray-100/60'
        >
          <span className='text-xl'>🔒</span>
        </span>
      )}

      {isHovered && (
        <span
          className={classNames(
            selected || stat.is_locked
              ? 'bg-primary !text-white'
              : 'bg-slate-50 !text-black',
            'absolute inset-0 z-10 flex items-center justify-center rounded-md text-xs'
          )}
        >
          {stat.description}
        </span>
      )}
    </button>
  );
}
