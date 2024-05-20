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
  params,
}: {
  children: React.ReactNode;
  params: any;
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
