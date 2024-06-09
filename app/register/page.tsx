'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Formik, Form } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toFormikValidate } from 'zod-formik-adapter';

import logo from '../assets/logo.png';
import AuthFormInput from '../lib/components/_auth/AuthFormInput';
import AuthFormButton from '../lib/components/_auth/AuthFormButton';
import AuthContainer from '../lib/components/_auth/AuthContainer';
import { useAuth } from '../GlobalContext';
import { eyeClosedIcon, eyeOpenIcon } from '@/app/lib/SVGs';
import { registerRequest } from '@/app/lib/requests/auth';
import { inputContainerClasses } from '../lib/globals/styles';

const Schema = z
  .object({
    name: z.string().min(1, { message: 'Please tell us your name' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' }),
  })
  .partial()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function Register() {
  const router = useRouter();

  const { status } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const [backendRegistrationError, setBackendRegistrationError] = useState<{
    isError: boolean;
    message: string | null;
  }>({
    isError: false,
    message: null,
  });

  if (status === 'authenticated') return router.push('/');

  return (
    <AuthContainer>
      <div className='w-full rounded-xl border border-violet-100 p-6 sm:w-auto sm:min-w-[500px]'>
        {/* <div className="relative h-14 w-auto bg-primary p-4">
            <Image
              src={logo}
              alt="keepr Logo"
              layout="fill"
              style={{ objectFit: "scale-down" }}
            />
          </div> */}
        <div className='mb-10 hidden w-full text-center text-4xl font-bold text-primary sm:block'>
          keepr
        </div>
        <Formik
          validate={toFormikValidate(Schema)}
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            setIsAwaitingResponse(true);
            try {
              const response = await registerRequest({
                name: values.name,
                email: values.email,
                password: values.password,
              });
              const result = await response.json();

              if (!response.ok) {
                if (response.status === 422) {
                  result.errors['email']
                    ? setErrors({ email: result.errors['email'][0] })
                    : null;
                } else {
                  setBackendRegistrationError({
                    isError: true,
                    message:
                      'Something went wrong with the registration, please try again.',
                  });
                }
              }

              if (response.ok) {
                await signIn('credentials', {
                  email: result.user.email,
                  password: values.password,
                  redirect: false, //TODO: redirect to validate
                });
              }
            } catch (error) {
              console.log(`Registration error: ${error}`);
            }
            setIsAwaitingResponse(false);
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(props) => (
            <Form
              className={inputContainerClasses}
              onChange={() =>
                backendRegistrationError.isError &&
                setBackendRegistrationError({
                  isError: false,
                  message: null,
                })
              }
            >
              <div className='flex flex-col'>
                <AuthFormInput
                  placeholder='John Smith'
                  name='name'
                  label='Name'
                  type='text'
                  isError={props.errors.name ? true : false}
                />
              </div>

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
                  placeholder='New Password'
                  name='password'
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  isError={props.errors.password ? true : false}
                  icon={showPassword ? eyeOpenIcon : eyeClosedIcon}
                  iconFn={() => setShowPassword((prev) => !prev)}
                />
              </div>
              <div className='flex flex-col'>
                <AuthFormInput
                  placeholder='Re-type Password'
                  name='confirmPassword'
                  label='Confirm Password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  isError={props.errors.confirmPassword ? true : false}
                  icon={showConfirmPassword ? eyeOpenIcon : eyeClosedIcon}
                  iconFn={() => setShowConfirmPassword((prev) => !prev)}
                />
              </div>

              {backendRegistrationError.isError ? (
                <div className='w-full text-center text-sm text-red-500'>
                  {backendRegistrationError.message}
                </div>
              ) : null}
              <AuthFormButton
                label='Create an Account'
                isLoadingRequest={isAwaitingResponse}
              />
            </Form>
          )}
        </Formik>
        <div className='mt-6 w-full pr-2 text-end text-sm font-medium text-zinc-600'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-bold text-primary transition-all hover:text-blue-600'
          >
            Click here
          </Link>{' '}
          to log in
        </div>
      </div>
    </AuthContainer>
  );
}
