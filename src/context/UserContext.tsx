'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '@/type';
import { useAppContext } from './AppContext';
import { UserService } from '@/service/useCase/user.service';

type UserProviderProps = {
  children: ReactNode;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const defalutContextData = {
  user: null,
  setUser: () => {}
};

const UserContext = createContext<UserContextType>(defalutContextData);

export function UserProvider({ children }: UserProviderProps) {
  const { userId } = useAppContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = UserService.fetchUserSubscribe(userId, setUser);

    return () => unsubscribe();
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
