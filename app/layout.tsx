import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { getServerSession } from 'next-auth';

import Providers from '@/app/providers';
import { authOptions } from '@/app/api/auth/auth';
import { Toaster } from '@/app/lib/components/_toast/toaster';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'keepr',
  description:
    'Run your sports league efficiently with keepr. From game scheduling to player stats, we provide everything league administrators need to manage their organization in one place.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextTopLoader shadow={false} showSpinner={false} color='#03C988' />
        <Providers session={session}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
