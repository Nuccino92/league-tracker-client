import '@/app/globals.css';
import type { Metadata } from 'next';

import AuthGuard from '@/app/lib/components/_auth/AuthGuard';
import LeagueControlPanelProvider from '@/app/control-panel/_components/LeagueControlPanelProvider';
import RoleGuard from '@/app/control-panel/_components/RoleGuard';

export const metadata: Metadata = {
  title: 'Control Panel - League',
  description: 'Control Panel league description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <LeagueControlPanelProvider>
        <RoleGuard>{children}</RoleGuard>
      </LeagueControlPanelProvider>
    </AuthGuard>
  );
}
