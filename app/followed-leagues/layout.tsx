import type { Metadata } from 'next';

import '@/app/globals.css';
import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import AuthProvider from '@/app/lib/components/_auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Followed Leagues',
  description:
    'A location to view all the leagues that the user is connected with',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AuthProvider>{children} </AuthProvider>
    </AuthGuard>
  );
}
