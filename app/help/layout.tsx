import type { Metadata } from 'next';

import '@/app/globals.css';
import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import AuthProvider from '@/app/lib/components/_auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Help',
  description: 'Get help with anything',
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
