'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Image from 'next/image';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import classNames from 'classnames';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  RegistrationFormValues,
  registrationFormSchema,
} from '@/app/lib/types/registrationForm.types';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import {
  INPUT_CLASSES,
  INPUT_CONTAINER_CLASSES,
} from '@/app/lib/globals/styles';
import { Button } from '@/app/lib/components/Button';
import FileUpload from '@/app/lib/components/FileUpload';
import { DeleteIcon, Spinner } from '@/app/lib/SVGs';
import Checkbox from '@/app/lib/components/Checkbox';
import { useRegistrationForm } from '@/app/lib/hooks/api/registration';

import { Registration } from '@/app/lib/types/Responses/registration';
import ControlPanelTooltip from '@/app/control-panel/_components/ControlPanelTooltip';

/**
 * 
 * @returns 
 * 1. Player fills out form
 * 2. System checks email against player database
   - If email exists → Link to existing player record
   - If no email match → Create new player record
 * 3. Create season registration record

   - Tell user to use past emails to have it assiciate with previous player

   1. Collect registration info
2. Process payment through Stripe
3. If payment succeeds:
   - Create/find player record
   - Create registration record
   - Send confirmation
4. If payment fails:
   - Show error
   - Allow retry
   - Don't create any records
 */

type Props = {
  id: number;
  onSubmit: (formValues: RegistrationFormValues) => Promise<void>;
};

//TODO: take in the form information as a props/take in a registration form id and fetch this formation before loading it (see the CreateRegistrationFormModal).

//probably pass in the form id, then hit the registration_forms table find by id and get the additional information

enum RegistrationStep {
  INFORMATION,
  PAYMENT,
}

export default function RegistrationForm({ id, onSubmit }: Props) {
  const { data, status } = useRegistrationForm({ id });

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    RegistrationStep.INFORMATION
  );

  const initialValues: RegistrationFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    waiverAccepted: false,
    waiverSignature: '',
    //todo add paid amount
  };

  async function handleSubmit(values: RegistrationFormValues) {
    if (currentStep === RegistrationStep.INFORMATION) {
      setCurrentStep(RegistrationStep.PAYMENT);
    } else {
      // Handle payment and final submission
      await onSubmit(values);
    }
  }

  return (
    <StyledBox classes='border-0 rounded-xl'>
      {data && status === 'success' && (
        <Elements stripe={stripePromise}>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(registrationFormSchema)}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={false}
          >
            {({ values, setFieldValue, setFieldError, errors }) => (
              <>
                {currentStep === RegistrationStep.INFORMATION && (
                  <Form className='space-y-4 text-sm'>
                    <div className='mr-6 text-lg font-bold'>
                      {data.league.name}
                    </div>

                    <div className='text-base font-medium'>
                      {data.season.name} - Registration form
                    </div>

                    <p className='!mb-6'>{data.description}</p>

                    {/* Personal Information */}
                    <div
                      className={classNames('flex flex-col gap-3 sm:flex-row')}
                    >
                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel
                          label='First Name'
                          htmlFor='firstName'
                          required
                        />
                        <Field
                          type='text'
                          id='firstName'
                          name='firstName'
                          className={classNames('bg-gray-50', INPUT_CLASSES)}
                          placeholder='First name'
                        />
                        <ErrorMessage
                          name='firstName'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>

                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel
                          label='Last Name'
                          htmlFor='lastName'
                          required
                        />
                        <Field
                          type='text'
                          id='lastName'
                          name='lastName'
                          className={classNames('bg-gray-50', INPUT_CLASSES)}
                          placeholder='Last name'
                        />
                        <ErrorMessage
                          name='lastName'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>
                    </div>

                    <div
                      className={classNames('flex flex-col gap-3 sm:flex-row')}
                    >
                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel label='Email' htmlFor='email' required />

                        <div className='flex items-center gap-x-2'>
                          <Field
                            type='email'
                            id='email'
                            name='email'
                            className={classNames('bg-gray-50', INPUT_CLASSES)}
                            placeholder='Email address'
                          />
                          <ControlPanelTooltip
                            content={
                              <div className='max-w-[200px]'>
                                If you&apos;ve registered in previous seasons,
                                please use the same email address to link to
                                your existing player profile
                              </div>
                            }
                            classes='text-white font-medium bg-primary !py-3 text-sm mr-6'
                          />{' '}
                        </div>

                        <ErrorMessage
                          name='email'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>

                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel
                          label='Phone Number'
                          htmlFor='phone'
                          required
                        />
                        <Field
                          type='tel'
                          id='phone'
                          name='phone'
                          className={classNames('bg-gray-50', INPUT_CLASSES)}
                          placeholder='Phone number'
                        />
                        <ErrorMessage
                          name='phone'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>
                    </div>

                    <div className={INPUT_CONTAINER_CLASSES}>
                      <FormLabel
                        label='Upload your photo (optional)'
                        htmlFor='photo'
                      />

                      {values.photo ? (
                        <div className='relative h-[150px] w-full  rounded-md border border-slate-200'>
                          <Image
                            src={values.photo}
                            alt='Registrants photo'
                            style={{ objectFit: 'contain' }}
                            fill
                          />

                          <button
                            onClick={async () => {
                              /*
                               * TODO:
                               * await delete from s3
                               */

                              setFieldValue('photo', null);
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
                          changeEvent={(value) => setFieldValue('photo', value)}
                          errorEvent={(message) =>
                            setFieldError('photo', message)
                          }
                        />
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div
                      className={classNames('flex flex-col gap-3 sm:flex-row')}
                    >
                      {' '}
                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel
                          label='Emergency Contact Name (optional)'
                          htmlFor='emergencyContactName'
                        />
                        <Field
                          type='text'
                          id='emergencyContactName'
                          name='emergencyContactName'
                          className={classNames('bg-gray-50', INPUT_CLASSES)}
                          placeholder='Name'
                        />{' '}
                        <ErrorMessage
                          name='emergencyContactName'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>
                      <div
                        className={classNames(
                          'w-full',
                          INPUT_CONTAINER_CLASSES
                        )}
                      >
                        <FormLabel
                          label='Emergency Contact Phone (optional)'
                          htmlFor='emergencyContactPhone'
                        />
                        <Field
                          type='tel'
                          id='emergencyContactPhone'
                          name='emergencyContactPhone'
                          className={classNames('bg-gray-50', INPUT_CLASSES)}
                          placeholder='Phone'
                        />{' '}
                      </div>
                    </div>

                    <ErrorMessage
                      name='emergencyContactPhone'
                      component='div'
                      className='text-sm text-red-500'
                    />

                    {/* Waiver */}
                    <div>
                      <h3 className='mb-2 font-semibold'>
                        Waiver & Release Agreement
                      </h3>
                      <div className='swatches-picker mb-2 h-48 overflow-y-auto rounded border bg-gray-50 p-4 text-sm'>
                        <p className='mb-2'>
                          By registering for this league, I acknowledge and
                          agree that:
                        </p>
                        <ol className='list-decimal space-y-2 pl-4'>
                          <li>
                            I understand that participating in sports activities
                            involves risks of serious injury
                          </li>
                          <li>
                            I voluntarily assume all risks associated with
                            participation
                          </li>
                          <li>
                            I waive and release the league, organizers, and
                            facilities from liability for injuries
                          </li>
                          <li>
                            I am physically fit to participate in league
                            activities
                          </li>
                          <li>
                            I authorize emergency medical treatment if needed
                          </li>
                          <li>
                            I agree to follow league rules and regulations
                          </li>
                        </ol>
                      </div>

                      <div className='space-y-3'>
                        <div className='flex items-center gap-2 sm:px-2'>
                          <Checkbox
                            isChecked={values.waiverAccepted}
                            onClick={() =>
                              setFieldValue(
                                'waiverAccepted',
                                !values.waiverAccepted
                              )
                            }
                          />{' '}
                          <FormLabel
                            label='I accept the waiver terms and conditions'
                            htmlFor='waiverAccepted'
                            required
                            classes='sm:text-sm text-xs !whitespace-normal'
                          />
                        </div>
                        <ErrorMessage
                          name='waiverAccepted'
                          component='div'
                          className='text-sm text-red-500'
                        />
                      </div>
                    </div>

                    <div className={INPUT_CONTAINER_CLASSES}>
                      <FormLabel
                        label='Digital Signature'
                        htmlFor='waiverSignature'
                        required
                      />
                      <Field
                        type='text'
                        id='waiverSignature'
                        name='waiverSignature'
                        className={INPUT_CLASSES}
                      />
                      <ErrorMessage
                        name='waiverSignature'
                        component='div'
                        className='text-sm text-red-500'
                      />
                    </div>

                    <Button
                      type='submit'
                      className='w-full rounded px-4 py-2 text-white'
                    >
                      Continue to payment
                    </Button>
                  </Form>
                )}

                {currentStep === RegistrationStep.PAYMENT && (
                  <PaymentSection
                    registration={data}
                    formValues={values}
                    onBackClick={() =>
                      setCurrentStep(RegistrationStep.INFORMATION)
                    }
                  />
                )}
              </>
            )}
          </Formik>
        </Elements>
      )}

      {status === 'loading' && (
        <div className='flex h-[400px] w-full items-center justify-center'>
          <Spinner height={30} width={30} />
        </div>
      )}
    </StyledBox>
  );
}

function PaymentSection({
  registration,
  formValues,
  onBackClick,
}: {
  registration: Registration;
  formValues: RegistrationFormValues; //todo: possibly remove
  onBackClick: () => void;
}) {
  // TODO: fix up the stripe properly

  const stripe = useStripe();
  const elements = useElements();

  return (
    <div>
      <div className='mb-2 text-lg font-bold'>Checkout</div>
      <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
        <h3 className='mb-2 font-medium'>Registration Summary</h3>
        <div className='space-y-1 text-sm'>
          <div>
            Name: {formValues.firstName} {formValues.lastName}
          </div>
          <div>Email: {formValues.email}</div>
          <div>Phone: {formValues.phone}</div>
        </div>
      </div>
      <div className='mt-6 space-y-4'>
        <h3 className='font-semibold'>Registration Fee</h3>

        <div className='rounded-lg border bg-gray-50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='font-medium'>
                {registration.season.name} Registration
              </div>
              <div className='text-sm text-gray-600'>
                League: {registration.league.name}
              </div>
            </div>
            <div className='text-xl font-bold'>
              ${registration.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Stripe Elements Integration */}
        <div className={INPUT_CONTAINER_CLASSES}>
          <FormLabel label='Card Details' htmlFor='card-element' required />
          <div className={INPUT_CLASSES}>
            {/* Add Stripe Elements Component here */}
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className='flex items-center justify-between gap-2'>
          <Button
            disabled={!stripe || !elements}
            variant={'ghost'}
            onClick={onBackClick}
          >
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
          </Button>
          <Button
            type='submit'
            className='rounded px-4 py-2 text-white'
            disabled={!stripe || !elements}
          >
            Pay and Register ${registration.price.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
