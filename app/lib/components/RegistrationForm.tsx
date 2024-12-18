'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Image from 'next/image';

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
import { DeleteIcon } from '@/app/lib/SVGs';
import Checkbox from '@/app/lib/components/Checkbox';

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
  onSubmit: (formValues: RegistrationFormValues) => Promise<void>;
};

//TODO: take in the form information as a props/take in a registration form id and fetch this formation before loading it (see the CreateRegistrationFormModal).

//probably pass in the form id, then hit the registration_forms table find by id and get the additional information

export default function RegistrationForm({ onSubmit }: Props) {
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
  };

  return (
    <StyledBox>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(registrationFormSchema)}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {({ values, setFieldValue, setFieldError, errors }) => (
          <Form className='space-y-4 text-sm'>
            <button type='button' onClick={() => console.log(values, errors)}>
              check vals
            </button>
            {/* Personal Information */}
            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel label='First Name' htmlFor='firstName' required />
              <Field
                type='text'
                id='firstName'
                name='firstName'
                className={INPUT_CLASSES}
              />
              <ErrorMessage
                name='firstName'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel label='Last Name' htmlFor='lastName' required />
              <Field
                type='text'
                id='lastName'
                name='lastName'
                className={INPUT_CLASSES}
              />
              <ErrorMessage
                name='lastName'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel label='Email' htmlFor='email' required />
              <Field
                type='email'
                id='email'
                name='email'
                className={INPUT_CLASSES}
              />
              <ErrorMessage
                name='email'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel label='Phone Number' htmlFor='phone' required />
              <Field
                type='tel'
                id='phone'
                name='phone'
                className={INPUT_CLASSES}
              />
              <ErrorMessage
                name='phone'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel label='Upload your photo (optional)' htmlFor='photo' />

              {values.photo ? (
                <div className='relative h-[200px] w-full  rounded-md border border-slate-200 bg-white'>
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
                  errorEvent={(message) => setFieldError('photo', message)}
                />
              )}
            </div>

            {/* Emergency Contact */}
            <div className={INPUT_CONTAINER_CLASSES}>
              <div className='flex flex-col'>
                <FormLabel
                  label='Emergency Contact Name (optional)'
                  htmlFor='emergencyContactName'
                />
                <Field
                  type='text'
                  id='emergencyContactName'
                  name='emergencyContactName'
                  className={INPUT_CLASSES}
                />{' '}
              </div>
              <ErrorMessage
                name='emergencyContactName'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className={INPUT_CONTAINER_CLASSES}>
              <FormLabel
                label='Emergency Contact Phone (optional)'
                htmlFor='emergencyContactPhone'
              />
              <Field
                type='tel'
                id='emergencyContactPhone'
                name='emergencyContactPhone'
                className={INPUT_CLASSES}
              />{' '}
            </div>
            <ErrorMessage
              name='emergencyContactPhone'
              component='div'
              className='text-sm text-red-500'
            />

            {/* Waiver */}
            <div>
              <h3 className='mb-2 font-semibold'>Waiver & Release Agreement</h3>
              <div className='swatches-picker mb-2 h-48 overflow-y-auto rounded border bg-gray-50 p-4 text-sm'>
                <p className='mb-2'>
                  By registering for this league, I acknowledge and agree that:
                </p>
                <ol className='list-decimal space-y-2 pl-4'>
                  <li>
                    I understand that participating in sports activities
                    involves risks of serious injury
                  </li>
                  <li>
                    I voluntarily assume all risks associated with participation
                  </li>
                  <li>
                    I waive and release the league, organizers, and facilities
                    from liability for injuries
                  </li>
                  <li>
                    I am physically fit to participate in league activities
                  </li>
                  <li>I authorize emergency medical treatment if needed</li>
                  <li>I agree to follow league rules and regulations</li>
                </ol>
              </div>

              <div className='flex items-center gap-2'>
                <Checkbox
                  isChecked={values.waiverAccepted}
                  onClick={() =>
                    setFieldValue('waiverAccepted', !values.waiverAccepted)
                  }
                />
                <FormLabel
                  label='I accept the waiver terms and conditions'
                  htmlFor='waiverAccepted'
                  required
                />
              </div>
              <ErrorMessage
                name='waiverAccepted'
                component='div'
                className='text-sm text-red-500'
              />
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </StyledBox>
  );
}
