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
  isLoading: boolean;
};

const defalutContextData = {
  user: null,
  setUser: () => {},
  isLoading: true,
};

const UserContext = createContext<UserContextType>(defalutContextData);

export function UserProvider({ children }: UserProviderProps) {
  const { userId } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const user = await UserService.fetchUser(userId);
      setUser(user);
    };
    fetchData();
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
