'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import UserDropdown from '@/app/lib/components/UserDropdown';
import { IconBell } from '@/app/lib/SVGs';
import ROUTES from '@/app/lib/globals/routes';

export default function Header() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className='flex h-[80px] w-screen items-center justify-between border-b p-4 pr-10'>
      <Link
        href='#'
        onClick={(e) => {
          e.preventDefault();
          handleBack();
        }}
        className='mr-6 cursor-pointer pl-4 text-2xl font-bold text-secondary'
      >
        keepr
      </Link>
      <div className='flex items-center gap-6'>
        <Link href={ROUTES.NOTIFICATIONS}>
          <IconBell height={21} width={21} />
        </Link>
        <UserDropdown />
      </div>
    </div>
  );
}
