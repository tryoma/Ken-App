'use client';
import { AppProvider } from '@/context/AppContext';
import { UserProvider } from '@/context/UserContext';
import Notification from '@/app/components/Notification';
import PrivateCommonLayout from '../components/layout/PrivateCommonLayout';
import { ToastProvider } from '@/context/ToastContext';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <ToastProvider>
        <Notification />
        <UserProvider>
          <PrivateCommonLayout>{children}</PrivateCommonLayout>
        </UserProvider>
      </ToastProvider>
    </AppProvider>
  );
}
