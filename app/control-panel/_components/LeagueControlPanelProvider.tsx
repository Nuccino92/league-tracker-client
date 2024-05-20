'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import Lottie from 'react-lottie';

import animationData from '@/app/assets/animations/horizontal-moving-circles.json';
import { useLeague } from '@/app/lib/hooks/api/control-panel';
import { ControlPanelInformation } from '@/app/lib/types/Responses/control-panel.types';

export default function LeagueControlPanelProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params: any = useParams();

  const { data: leagueData, status, error } = useLeague(params['league-name']);

  if (status === 'loading')
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        {/* TODO: fix warning
        react-dom.development.js:94 Warning: componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
        */}
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
    );

  return (
    <LeagueControlPanelContext.Provider value={{ leagueData: leagueData }}>
      {status === 'success' ? <>{children}</> : null}
    </LeagueControlPanelContext.Provider>
  );
}

export const LeagueControlPanelContext = createContext({
  leagueData: {} as ControlPanelInformation | undefined,
});

export function useLeagueControlPanel() {
  const { leagueData } = useContext(LeagueControlPanelContext);

  return { leagueData };
}
