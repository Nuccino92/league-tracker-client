'use client'; // Error components must be Client Components

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import NotFound from '../lib/components/NotFound';
import ROUTES from '../lib/routesConfig';
import classNames from 'classnames';

export default function Error({
  error,
  reset,
}: {
  error: NotOk & { digest?: string; owner_id?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const { message } = error;
  const { statusCode } = error;

  console.log(error.owner_id);

  // TODO: REFACTOR TO HANDLE all of ORGANIZATION/LEAGUE
  // TODO; make the design better

  //TODO: @IMPORTANT. check to see if its inactive and this is the owner to add a payment/link to where they can resubscribe

  return (
    <div className='h-screen'>
      {statusCode === 403 && message === 'unauthorized' ? (
        <div>You do not have access</div>
      ) : null}

      {statusCode === 403 && message === 'inactive' ? (
        <div className='flex h-full flex-col items-center justify-center space-y-4'>
          <h1 className='text-xl'>The leagues Subscription has expired</h1>

          <div className='space-y-3'>
            <p>Visit profile to re-activate your leagues</p>
            <div className='flex items-center space-x-2'>
              {' '}
              <button
                className='h-10 w-full rounded bg-secondary px-4 text-sm font-medium text-white'
                onClick={() => router.back()}
                type='button'
              >
                Back
              </button>
              <LinkButton
                path={ROUTES.PROFILE}
                text='Profile'
                classes='w-full !bg-primary'
              />
            </div>
          </div>
        </div>
      ) : null}

      {statusCode === 404 ? (
        <NotFound>
          <div className='text-2xl font-bold'>
            We cannot find what you are looking for
          </div>
          <div className='mt-6 flex items-center justify-center space-x-5 font-medium text-white'>
            <Link
              className='flex h-10 items-center justify-center rounded bg-secondary px-4'
              href={'/'}
            >
              Home
            </Link>
            <button
              className='h-10 rounded bg-primary px-4'
              onClick={() => router.back()}
              type='button'
            >
              Back
            </button>
          </div>
        </NotFound>
      ) : null}
    </div>
  );
}

function LinkButton({
  path,
  text,
  classes,
}: {
  path: string;
  text: string;
  classes?: string;
}) {
  return (
    <Link
      href={path}
      className={classNames(
        classes,
        'flex h-10 items-center justify-center rounded bg-secondary px-4 text-sm font-medium text-white'
      )}
    >
      {text}
    </Link>
  );
}
