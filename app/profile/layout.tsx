import '@/app/globals.css';
import type { Metadata } from 'next';
import AuthGuard from '../lib/components/_auth/AuthGuard';
export const metadata: Metadata = {
  title: 'Profile',
  description: 'profile page',
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
