import ErrorIcon from '@/app/components/icons/ErrorIcon';
import InfoIcon from '@/app/components/icons/InfoIcon';
import SuccessIcon from '@/app/components/icons/SuccessIcon';
import { createContext, useContext, useCallback, ReactNode } from 'react';
import toast, { ToastOptions, Toaster } from 'react-hot-toast';

// トーストのためのコンテキストを作成
const ToastContext = createContext<
  ((message: string, type?: NotificationType) => void) | null
>(null);

// 通知タイプを定義
type NotificationType = 'success' | 'error' | 'info';

const getToastOptions = (type: NotificationType): ToastOptions => {
  switch (type) {
    case 'success':
      return {
        icon: <SuccessIcon />,
        style: { border: '1px solid #4CAF50', backgroundColor: '#DFF2BF' },
      };
    case 'error':
      return {
        icon: <ErrorIcon />,
        style: { border: '1px solid #F44336', backgroundColor: '#FFBABA' },
      };
    case 'info':
      return {
        icon: <InfoIcon />,
        style: { border: '1px solid #2196F3', backgroundColor: '#BDE5F8' },
      };
    default:
      return {}; // Default style if type is not specified
  }
};

// トーストを表示する関数を提供するProviderコンポーネント
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const notify = useCallback(
    (message: string, type: NotificationType = 'info') => {
      // 既存のトーストをすべてクリア
      toast.dismiss();

      const options = getToastOptions(type);
      toast(message, options);
    },
    []
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <Toaster
        toastOptions={{
          duration: 5000,
          style: {
            zIndex: 9999, // 高い値を設定して他の要素よりも前に表示
          },
        }}
      />
    </ToastContext.Provider>
  );
};

// カスタムフック
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
