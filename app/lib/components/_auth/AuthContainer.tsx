import { ReactNode } from 'react';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

export default function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <div className='flex w-full flex-col items-center justify-center sm:h-screen'>
      <AuthHeader />
      <div className='flex h-full w-full items-center justify-center'>
        {children}
      </div>
      <AuthFooter />
    </div>
  );
}
