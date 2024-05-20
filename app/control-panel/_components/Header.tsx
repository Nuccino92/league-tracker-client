'use client';

import { useAuth } from '@/app/GlobalContext';
import UserDropdown from '@/app/lib/components/UserDropdown';

export default function Header() {
  return (
    <header className='flex h-20 items-center justify-end border-b px-10'>
      <UserDropdown />
    </header>
  );
}
