import '@/app/globals.css';
import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Panel',
  description: 'Control panel description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div>{children}</div>
    </AuthGuard>
  );
}
