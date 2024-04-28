'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';
import { useUserContext } from '@/context/UserContext';

interface SidebarItemProps {
  path: string;
  label: string;
  currentPath: string;
  count?: number;
}

const Sidebar = () => {
  const { userId } = useAppContext();
  const { user } = useUserContext();
  const pathname = usePathname();
  const [adviceRequestsCount, setAdviceRequestsCount] = useState(0);
  const [adviceRequestForMeCount, setAdviceRequestForMeCount] = useState(0);
  const [nowPage, setNowPage] = useState<string>('');

  useEffect(() => {
    const pagePath = getPagePath(pathname);
    setNowPage(getPageName(pagePath));
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const count1 = await AdviceRequestService.fetchAdviceRequestsCount(
        userId,
        'prepared'
      );
      setAdviceRequestsCount(count1);

      const count2 = await AdviceRequestService.fetchAdviceRequestsForMeCount(
        userId,
        'requested'
      );
      setAdviceRequestForMeCount(count2);
    };
    fetchData();
  }, [pathname, userId]);

  const getPagePath = (path: string): string => {
    const pathArray = path.split('/general/');
    return pathArray[1];
  };

  const getPageName = (pagePath: string): string => {
    switch (pagePath) {
      case 'dashboard':
        return 'ダッシュボード';
      case 'dashboard/my-training-records':
        return 'マイ記録一覧';
      case 'dashboard/trainers':
        return 'トレーナー一覧';
      case 'dashboard/advice-requests':
        return 'アドバイス依頼一覧';
      case 'dashboard/advice-requests-for-me':
        return '自分への依頼一覧';
      default:
        return 'その他';
    }
  };

  const SidebarItem = ({
    path,
    label,
    currentPath,
    count = 0,
  }: SidebarItemProps) => (
    <li>
      <div className="flex items-center">
        <Link
          href={path}
          className={`${
            currentPath === label ? 'font-bold text-blue-500' : ''
          }`}
        >
          {label}
        </Link>
        {count > 0 && (
          <span className="pl-1">
            <Image
              src="/images/icons/exclamation-mark.png"
              alt="exclamation-mark"
              width={20}
              height={20}
              style={{ alignSelf: 'center' }}
            />
          </span>
        )}
      </div>
    </li>
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-4">メニュー</h2>
      <ul className="space-y-2">
        <SidebarItem
          path="/private/general/dashboard"
          label="ダッシュボード"
          currentPath={nowPage}
        />
        <SidebarItem
          path="/private/general/dashboard/my-training-records"
          label="マイ記録一覧"
          currentPath={nowPage}
        />
        <SidebarItem
          path="/private/general/dashboard/trainers"
          label="トレーナー一覧"
          currentPath={nowPage}
        />
        <SidebarItem
          path="/private/general/dashboard/advice-requests"
          label="アドバイス依頼一覧"
          currentPath={nowPage}
          count={adviceRequestsCount}
        />
        {user?.isTrainer && (
          <SidebarItem
            path="/private/general/dashboard/advice-requests-for-me"
            label="自分への依頼一覧"
            currentPath={nowPage}
            count={adviceRequestForMeCount}
          />
        )}
      </ul>
    </>
  );
};

export default Sidebar;
