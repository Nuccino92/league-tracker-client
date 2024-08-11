'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

import { User } from './lib/types/Models/User';

const CreateLeagueModal = dynamic(
  () => import('@/app/lib/components/CreateLeagueModal'),
  {
    loading: () => <></>,
  }
);

export default function GlobalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status, data, update } = useSession();

  const [showCreateLeaugueModal, setShowCreateLeagueModal] = useState(false);

  const isUserLoggedIn = status === 'authenticated' ? true : false;

  const user = isUserLoggedIn
    ? (data!.user as { user: User | null; token: string })
    : null;

  return (
    <GlobalContext.Provider
      value={{
        expires: isUserLoggedIn ? data!.expires : (null as unknown as string),
        user: user as any,
        token: user?.token ?? '',
        status,
        update,
        showCreateLeaugueModal,
        setShowCreateLeagueModal,
      }}
    >
      {children}
      <CreateLeagueModal />
    </GlobalContext.Provider>
  );
}

export const GlobalContext = createContext({
  expires: '',
  user: null as User | null,
  token: '' as string,
  status: 'loading' as 'authenticated' | 'loading' | 'unauthenticated',
  update: (() => {}) as any,
  showCreateLeaugueModal: false,
  setShowCreateLeagueModal: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

export function useAuth() {
  return useContext(GlobalContext);
}

export function useIsFreeTrialAvailable() {
  const { user, status } = useContext(GlobalContext);
  if (status === 'unauthenticated' || !user) return false;

  const { trial_ends_at } = user;

  if (!trial_ends_at) {
    return true;
  } else {
    return false;
  }
}

export function useCreateLeague() {
  const { showCreateLeaugueModal, setShowCreateLeagueModal } =
    useContext(GlobalContext);
  return { showCreateLeaugueModal, setShowCreateLeagueModal };
}
