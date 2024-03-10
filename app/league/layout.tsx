import '@/app/globals.css';
import type { Metadata } from 'next';
import Providers from '@/app/providers';
import ScheduleBar from './_components/ScheduleBar';
import AppNav from '../lib/components/AppNav';
import Footer from '../lib/components/Footer';

export const metadata: Metadata = {
  title: 'The league name',
  description: 'The leagues desc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ScheduleBar />
      <AppNav />
      {children}
      <Footer />
    </div>
  );
}
