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
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const defalutContextData = {
  user: null,
  isAdmin: false,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(defalutContextData);

export function UserProvider({ children }: UserProviderProps) {
  const { userId } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const setUserAndAdmin = (user: User | null) => {
    setUser(user);
    setIsAdmin(user?.isAdmin || false);
  };

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = UserService.fetchUserSubscribe(userId, setUserAndAdmin);

    return () => unsubscribe();
  }, [userId]);

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
