'use client';

import { ReactNode } from 'react';
import classNames from 'classnames';

import AuthHeader from '@/app/lib/components/_auth/AuthHeader';
import AuthFooter from '@/app/lib/components/_auth/AuthFooter';
import AuthSidebar from '@/app/lib/components/_auth/AuthSidebar';
import { useAuthed } from '@/app/lib/components/_auth/AuthProvider';

export default function AuthedContainer({ children }: { children: ReactNode }) {
  const { sidebar } = useAuthed();

  return (
    <div className='flex min-h-screen w-full'>
      <AuthSidebar />
      <div
        className={classNames(
          sidebar.isOpen ? 'ml-64' : 'ml-16',
          'flex w-full flex-1 flex-col'
        )}
      >
        <div className='sticky top-0 bg-white'>
          <AuthHeader />
        </div>

        <main className='flex-1 bg-slate-50 p-6'>{children}</main>
        <AuthFooter />
      </div>
    </div>
  );
}
