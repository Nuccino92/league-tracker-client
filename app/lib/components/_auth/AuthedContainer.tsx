'use client';

import { ReactNode } from 'react';
import classNames from 'classnames';

import AuthHeader from '@/app/lib/components/_auth/AuthHeader';
import AuthFooter from '@/app/lib/components/_auth/AuthFooter';
import AuthSidebar from '@/app/lib/components/_auth/AuthSidebar';
import { useAuthed } from '@/app/lib/components/_auth/AuthProvider';

export default function AuthedContainer({ children }: { children: ReactNode }) {
  const { isOpen } = useAuthed();

  return (
    <div className='flex min-h-screen w-full'>
      <AuthSidebar />
      <div
        className={classNames(
          isOpen ? 'ml-64' : 'ml-16',
          'flex w-full flex-1 flex-col'
        )}
      >
        <div>
          <AuthHeader />
        </div>

        <main className='flex-1 p-6'>{children}</main>
        <AuthFooter />
      </div>
    </div>
  );
}
