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

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;
  settingChangeFlag: boolean;
  setSettingChangeFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  isLoading: true,
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectRoomName: null,
  setSelectRoomName: () => {},
  settingChangeFlag: false,
  setSettingChangeFlag: () => {},
};

const AppContext = createContext<AppContextType>(defalutContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectRoomName, setSelectRoomName] = useState<string | null>(null);
  const [settingChangeFlag, setSettingChangeFlag] = useState(false);
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

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        isLoading,
        selectedRoom,
        setSelectedRoom,
        selectRoomName,
        setSelectRoomName,
        settingChangeFlag,
        setSettingChangeFlag,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
