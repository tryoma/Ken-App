'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/Loading';

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
};

const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  isLoading: true,
};

const AppContext = createContext<AppContextType>(defalutContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, newUser => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      if (!newUser || !newUser.emailVerified) {
        router.push('/auth/login');
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
