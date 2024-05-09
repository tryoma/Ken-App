'use client';

import { useToastContext } from '@/context/ToastContext';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const Admin = () => {
  const { isAdmin } = useUserContext();
  const showToast = useToastContext();
  const router = useRouter();

  if (!isAdmin) {
    showToast('権限がありません', 'error');
    router.push('/private/general/dashboard');
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex space-x-4 px-4">
        <button className="bg-blue-500 px-4 py-2 rounded">すべて</button>
        <button className="px-4 py-2 rounded">更新</button>
        <button className="px-4 py-2 rounded">ゲーム</button>
      </div>
    </div>
  );
};

export default Admin;
