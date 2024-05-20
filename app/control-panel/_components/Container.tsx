'use client';

import { PropsWithChildren } from 'react';

import Header from '@/app/control-panel/_components/Header';
import Sidebar from '@/app/control-panel/_components/Sidebar';
import { ProfileViewType } from '@/app/lib/types/profile.types';

export default function Container({
  children,
  view,
}: PropsWithChildren & { view: ProfileViewType }) {
  return (
    <div className='relative'>
      <div className='sticky top-0 z-10 w-full bg-white'>
        <Header />
      </div>

      <div className='flex'>
        <Sidebar view={view} />

        <div className='ml-[76px] w-full bg-slate-100 p-2 sm:p-6 lg:ml-0'>
          {children}
        </div>
      </div>
    </div>
  );
}
