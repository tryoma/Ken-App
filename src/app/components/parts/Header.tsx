'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../../../../firebase';
import { useAppContext } from '@/context/AppContext';
import { User } from '@/type';
import UserIconAndName from './UserIconAndName';
import { UserService } from '@/service/useCase/user.service';
import { NotificationService } from '@/service/useCase/notification.service';

const Header = () => {
  const { userId, settingChangeFlag } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [notWatchNotificationCount, setNotWatchNotificationCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const user = await UserService.fetchUser(userId);
      setUser(user);
      const count = await NotificationService.fetchNotificationsCount(userId);
      setNotWatchNotificationCount(count);
    };
    fetchData();
  }, [userId, settingChangeFlag]);

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSideBarClick = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const defaultMenues = [
    {
      title: 'ダッシュボード',
      key: 'dashboard',
      href: '/private/general/dashboard',
      count: 0,
    },
    {
      title: 'お知らせ',
      key: 'notifications',
      href: '/private/notifications',
      count: notWatchNotificationCount,
    },
  ];

  const settingMenues = [
    {
      title: 'プロフィール',
      key: 'profile',
      description: 'プロフィールの変更が可能です',
      href: '/private/profile',
      count: 0,
    },
    {
      title: 'ポイント購入',
      key: 'point',
      description: 'ポイントを購入することができます',
      href: '/private/point',
      count: 0,
    },
    {
      title: 'ポイント履歴',
      key: 'point-history',
      description: '購入履歴を確認することができます',
      href: '/private/point-history',
      count: 0,
    },
    {
      title: 'お問い合わせ',
      key: 'inquiry-form',
      description: '問い合わせをおこないます',
      href: '/private/inquiry-form',
      count: 0,
    },
  ];

  const allMenues = [...defaultMenues, ...settingMenues];

  return (
    <header className="bg-white fixed top-0 w-full z-[1000]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Image
            src="/images/logo/logo.jpg"
            width={100}
            height={100}
            alt="Picture of the author"
            className="h-8 w-auto"
          />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={handleSideBarClick}
          >
            <Image
              src="/images/icons/menu.png"
              width={24}
              height={24}
              alt="menu"
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {defaultMenues.map(menu => (
            <Link
              key={menu.key}
              href={menu.href}
              className="flex content-center text-sm font-semibold leading-6 text-gray-900"
            >
              {menu.title}
              {menu.count > 0 && (
                <span className="pl-1 m-auto">
                  <Image
                    src="/images/icons/exclamation-mark.png"
                    alt="exclamation-mark"
                    width={15}
                    height={15}
                    style={{ alignSelf: 'center' }}
                  />
                </span>
              )}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              aria-expanded="false"
              onClick={handleSettingsClick}
            >
              設定
              <Image
                src="/images/icons/under-arrow.png"
                width={16}
                height={16}
                alt="under-arrow"
                className={isSettingsOpen ? 'transform rotate-180' : ''}
              />
            </button>
            {isSettingsOpen && (
              <div className="absolute -left-1 top-full z-10 mt-3 w-screen max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {settingMenues.map(menu => (
                    <div
                      key={menu.key}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex-auto">
                        <Link
                          href={menu.href}
                          className="block font-semibold text-gray-900"
                          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        >
                          {menu.title}
                          <span className="absolute inset-0"></span>
                        </Link>
                        <p className="mt-1 text-gray-600">{menu.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                    <div className="flex-auto">
                      <a
                        onClick={() => handleLogout()}
                        className="block font-semibold text-blue-500 cursor-pointer"
                      >
                        ログアウト<span aria-hidden="true">&rarr;</span>
                        <span className="absolute inset-0"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user && <UserIconAndName user={user} />}
        </div>
      </nav>
      <div className="lg:hidden" role="dialog" aria-modal="true">
        {!isSideBarOpen && (
          <>
            <div className="fixed inset-0 z-10"></div>
            <div className="fixed inset-y-0 h-5/6 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                {user && <UserIconAndName user={user} />}
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={handleSideBarClick}
                >
                  <span className="sr-only">Close menu</span>
                  <Image
                    src="/images/icons/close.png"
                    width={24}
                    height={24}
                    alt="close"
                  />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {allMenues.map(menu => (
                      <Link
                        key={menu.key}
                        href={menu.href}
                        className="flex -mx-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                      >
                        {menu.title}
                        {menu.count > 0 && (
                          <span className="pl-1 my-auto">
                            <Image
                              src="/images/icons/exclamation-mark.png"
                              alt="exclamation-mark"
                              width={15}
                              height={15}
                              style={{ alignSelf: 'center' }}
                            />
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      onClick={() => handleLogout()}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      ログアウト <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
