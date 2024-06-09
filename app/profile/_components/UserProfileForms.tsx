'use client';

import { useState } from 'react';
import { FastField, Form, Formik, FormikValues, ErrorMessage } from 'formik';
import { z } from 'zod';
import { toFormikValidate } from 'zod-formik-adapter';
import classNames from 'classnames';

import { useAuth } from '@/app/GlobalContext';
import AuthFormInput from '@/app/lib/components/_auth/AuthFormInput';
import { eyeClosedIcon, eyeOpenIcon } from '@/app/lib/SVGs';
import { inputClasses, inputContainerClasses } from '@/app/lib/globals/styles';

const AccountInformationSchema = z.object({
  name: z.string().min(1, { message: 'A name is required' }),
  email: z.string().email({ message: 'The new email is invalid' }),
});

const NewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' }),
    confirmNewPassword: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' }),
  })
  .partial()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

export default function UserProfileForms() {
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='flex flex-col items-center space-y-8'>
      <Formik
        onSubmit={async (values, { setErrors }) => {
          try {
            console.log('FORM VALS', values);
          } catch (error) {}
        }}
        initialValues={{
          name: user.name,
          email: user.email,
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validate={toFormikValidate(AccountInformationSchema)}
      >
        {(props) => (
          <Form className='flex w-full flex-col space-y-6 rounded-xl border border-violet-100 bg-white p-6 md:w-[650px]'>
            <h2 className='text-xl font-bold'>Account information</h2>
            <div className={inputContainerClasses}>
              <FormLabel name='Username' htmlFor='name' />
              <FastField
                name='name'
                className={inputClasses}
                id='name'
                placeholder='Enter your user name'
              />
              <ErrorMessage
                name={'name'}
                component='div'
                className='ml-2 mt-1 text-sm text-red-400'
              />
            </div>

            <div className={inputContainerClasses}>
              <FormLabel name='Email' htmlFor='email' />
              <FastField
                name='email'
                className={inputClasses}
                id='email'
                placeholder='Enter your email'
              />
              <ErrorMessage
                name={'email'}
                component='div'
                className='ml-2 mt-1 text-sm text-red-400'
              />
            </div>
            <button
              disabled={!props.dirty}
              className={classNames(
                props.dirty ? 'bg-secondary' : ' bg-gray-200',
                'self-end rounded p-2 font-medium text-white'
              )}
            >
              Update
            </button>
          </Form>
        )}
      </Formik>
      <Formik
        onSubmit={async (values, { setErrors }) => {
          try {
            console.log('FORM VALS', values);
          } catch (error) {}
        }}
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        validate={toFormikValidate(NewPasswordSchema)}
      >
        {(props) => (
          <Form className='flex w-full flex-col space-y-6 rounded-xl border border-violet-100 bg-white p-6 md:w-[650px]'>
            <h2 className='text-xl font-bold'>Change Password</h2>
            <div className={inputContainerClasses}>
              <AuthFormInput
                placeholder='New Password'
                name='newPassword'
                label='New Password'
                type={showPassword ? 'text' : 'password'}
                isError={props.errors.newPassword ? true : false}
                icon={showPassword ? eyeOpenIcon : eyeClosedIcon}
                iconFn={() => setShowPassword((prev) => !prev)}
              />
            </div>
            <div className={inputContainerClasses}>
              <AuthFormInput
                placeholder='Re-type password'
                name='confirmNewPassword'
                label='Confirm Password'
                type={showConfirmPassword ? 'text' : 'password'}
                isError={props.errors.newPassword ? true : false}
                icon={showConfirmPassword ? eyeOpenIcon : eyeClosedIcon}
                iconFn={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>

            <button
              disabled={
                !props.dirty &&
                !props.values.confirmNewPassword &&
                !props.values.newPassword
              }
              className={classNames(
                props.dirty &&
                  props.values.confirmNewPassword &&
                  props.values.newPassword
                  ? 'bg-secondary'
                  : ' bg-gray-200',
                'self-end rounded p-2 font-medium text-white'
              )}
            >
              Save password
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function FormLabel({ name, htmlFor }: { name: string; htmlFor: string }) {
  return (
    <label className='font-medium' htmlFor={htmlFor}>
      {name}
    </label>
  );
}
