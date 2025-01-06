import type { Metadata } from 'next';

import '@/app/globals.css';
import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import AuthProvider from '@/app/lib/components/_auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'notifications page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AuthProvider>
        <div>{children}</div>
      </AuthProvider>
    </AuthGuard>
  );
}
