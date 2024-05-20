import { ReactNode } from 'react';
import Lottie from 'react-lottie';

import animationData from '@/app/assets/animations/not-found.json';

export default function NotFound({ children }: { children: ReactNode }) {
  return (
    <main className='flex h-[80vh] w-full flex-col items-center justify-center'>
      {children}
      <div className='flex flex-col items-center justify-center'>
        <Lottie
          height={250}
          width={250}
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
          }}
        />
      </div>
    </main>
  );
}
