'use client';

import { ReactNode, createContext, useContext } from 'react';
import { User } from './lib/types/Models/User';
import { useSession } from 'next-auth/react';

export default function GlobalContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status, data, update } = useSession();

  const isUserLoggedIn = status === 'authenticated' ? true : false;

  const user = isUserLoggedIn
    ? (data!.user as { user: User | null; token: string })
    : null;

  return (
    <GlobalContext.Provider
      value={{
        expires: isUserLoggedIn ? data!.expires : (null as unknown as string),
        user: user,
        token: user?.token ?? null,
        status,
        update,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const GlobalContext = createContext({
  expires: '',
  user: null as any | null,
  token: null as string | null,
  status: 'loading' as 'authenticated' | 'loading' | 'unauthenticated',
  update: (() => {}) as any,
});

export function useAuth() {
  return useContext(GlobalContext);
}
