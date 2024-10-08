import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { getServerSession } from 'next-auth';

import Providers from './providers';
import { authOptions } from './api/auth/auth';
import { Toaster } from './lib/components/_toast/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'keepr',
  description: 'Generated by create next app',
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
