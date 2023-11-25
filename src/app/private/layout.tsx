'use client';
import { AppProvider } from '@/context/AppContext';
import { UserProvider } from '@/context/UserContext';
import Notification from '@/app/components/Notification';
import PrivateCommonLayout from '../components/layout/PrivateCommonLayout';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      {/* <Notification /> */}
      <UserProvider>
        <PrivateCommonLayout>{children}</PrivateCommonLayout>
      </UserProvider>
    </AppProvider>
  );
}
