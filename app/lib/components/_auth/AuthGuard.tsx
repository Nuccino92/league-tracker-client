import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/auth';

type Props = {
  children: ReactNode;
};

export default async function AuthGuard({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect('/login');

  return <>{children}</>;
}
