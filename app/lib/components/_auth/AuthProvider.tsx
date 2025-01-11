'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { IS_AUTH_SIDEBAR_OPEN } from '@/app/lib/globals/localStorage';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isOpen, toggleSidebar } = useAuthSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        {/* Optional loading state */}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </AuthContext.Provider>
  );
}

interface AuthContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthed() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthed must be used within a AuthProvider');
  }

  const { isOpen, toggleSidebar } = context;

  return { sidebar: { isOpen, toggleSidebar } };
}

const getInitialState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(IS_AUTH_SIDEBAR_OPEN);
    return stored ? JSON.parse(stored) : true; // Default to true if no value exists
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return false;
  }
};

export const useAuthSidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Set up client-side state
  useEffect(() => {
    setIsClient(true);
    const initialState = getInitialState();
    setIsOpen(initialState);
  }, []);

  // Sync with localStorage when state changes
  useEffect(() => {
    if (!isClient) return;

    try {
      window.localStorage.setItem(IS_AUTH_SIDEBAR_OPEN, JSON.stringify(isOpen));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [isOpen, isClient]);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return {
    isOpen,
    toggleSidebar,
  } as const;
};
