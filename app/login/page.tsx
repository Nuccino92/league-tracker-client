'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Formik, Form } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthFormInput from '../lib/components/AuthFormInput';
import AuthFormButton from '../lib/components/AuthFormButton';
import AuthContainer from '../lib/components/AuthContainer';
import { useAuth } from '../GlobalContext';
import { eyeClosedIcon, eyeOpenIcon } from '@/app/lib/SVGs';

const Schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' }),
});

export default function Login() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState<boolean>(
    typeof window !== 'undefined'
      ? localStorage.getItem('email')
        ? true
        : false
      : false
  );
  const [savedEmail, setSavedEmail] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('email') ?? '' : ''
  );

  const [backendValidationError, setBackendValidationError] = useState<{
    isError: boolean;
    message: string | null;
  }>({
    isError: false,
    message: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { status } = useAuth();

  if (status === 'authenticated') return router.push('/');

  return (
    <AuthContainer>
      <div className='w-full rounded-xl border border-violet-100 p-6 sm:w-auto sm:min-w-[500px]'>
        <div className='mb-10 w-full text-center text-4xl font-bold text-primary'>
          keepr
        </div>
        <Formik
          validate={toFormikValidate(Schema)}
          initialValues={{
            email: savedEmail,
            password: '',
          }}
          onSubmit={async (values) => {
            rememberMe && localStorage.setItem('email', values.email);
            await signIn('credentials', {
              email: values.email,
              password: values.password,
              redirect: false,
            }).then((res) => {
              if (res?.error) {
                return setBackendValidationError({
                  isError: true,
                  message: res.error,
                });
              } else {
                window.location.href = '/';
              }
            });
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(props) => (
            <Form
              className='flex flex-col space-y-3'
              onChange={() =>
                backendValidationError.isError &&
                setBackendValidationError({
                  isError: false,
                  message: null,
                })
              }
            >
              <div className='flex flex-col'>
                <AuthFormInput
                  placeholder='example@email.com'
                  name='email'
                  label='Email'
                  type='text'
                  isError={props.errors.email ? true : false}
                />
              </div>
              <div className='flex flex-col'>
                <AuthFormInput
                  placeholder='password'
                  name='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  isError={props.errors.password ? true : false}
                  icon={showPassword ? eyeOpenIcon : eyeClosedIcon}
                  iconFn={() => setShowPassword((prev) => !prev)}
                />
              </div>
              {backendValidationError.isError ? (
                <div className='flex w-full items-center justify-center text-sm text-red-500'>
                  {backendValidationError.message}
                </div>
              ) : null}
              <div className='flex items-center justify-between'>
                <div className='space-x-2'>
                  <input
                    type='checkbox'
                    id='rememberMe'
                    name='rememberMe'
                    value=''
                    className='h-4 w-4 rounded-sm border-slate-400 text-secondary focus:ring-secondary'
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  <span>
                    <label
                      className='w-full pr-2 text-sm font-medium text-zinc-600'
                      htmlFor='rememberMe'
                    >
                      Remember me
                    </label>
                  </span>
                </div>
                <Link
                  href='/login/reset'
                  className='text-sm font-medium text-primary transition-all hover:text-blue-600'
                >
                  Forgot password?
                </Link>
              </div>
              <AuthFormButton label='Log In' />
            </Form>
          )}
        </Formik>
        <div className='mt-6 w-full pr-2 text-end text-sm font-medium text-zinc-600'>
          Don&#39;t have an account?{' '}
          <Link
            href='/register'
            className='font-bold text-primary transition-all hover:text-blue-600'
          >
            Click here
          </Link>{' '}
          to register
        </div>
      </div>
    </AuthContainer>
  );
}
