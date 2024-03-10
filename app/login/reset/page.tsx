'use client';

import { z } from 'zod';

import AuthFormInput from '@/app/lib/components/AuthFormInput';
import { Formik, Form } from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import AuthFormButton from '@/app/lib/components/AuthFormButton';
import Link from 'next/link';
import AuthContainer from '@/app/lib/components/AuthContainer';

const Schema = z.object({
  email: z.string().min(1, { message: 'Please enter an email' }).email(),
});

export default function ResetPassword() {
  return (
    <AuthContainer>
      <div className='w-full rounded-xl border border-violet-100 p-6 sm:w-auto sm:min-w-[500px]'>
        <div className='mb-10 w-full text-center text-4xl font-bold text-primary'>
          keepr
        </div>
        <h1 className='mb-5 text-center text-2xl font-semibold sm:text-3xl'>
          Forgot your password?
        </h1>
        <Formik
          validate={toFormikValidate(Schema)}
          initialValues={{ email: '' }}
          // TODO: check if email exists on db before sending request
          onSubmit={(values) => console.log(values)}
        >
          {(props) => (
            <Form className='my-15 flex flex-col'>
              <AuthFormInput
                name='email'
                placeholder='example@email.com'
                label='Please enter your email used to sign in'
                type='text'
                isError={props.errors.email ? true : false}
              />{' '}
              <div className='relative mt-1 w-full'>
                <AuthFormButton label='Request password reset' />
              </div>
            </Form>
          )}
        </Formik>
        <Link
          href='/login'
          className='mx-auto mt-4 flex w-max items-center self-center text-sm font-medium text-primary transition-all hover:text-blue-600'
        >
          <span className='w-full text-center'>Back to Log in</span>
        </Link>
      </div>
    </AuthContainer>
  );
}
