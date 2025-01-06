import '@/app/globals.css';
import type { Metadata } from 'next';

import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import AuthProvider from '@/app/lib/components/_auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Create League',
  description: 'Create your league',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AuthProvider>{children}</AuthProvider>
    </AuthGuard>
  );
}
