'use client';

import { useEffect, useState } from 'react';
import { ExtendedNotification } from '@/type';
import { useAppContext } from '@/context/AppContext';
import { NotificationService } from '@/service/useCase/notification.service';
import { ReadNotificationService } from '@/service/useCase/read-notification.service';
import { useToastContext } from '@/context/ToastContext';
import {
  OpenReadIcon,
  OpenReadIconRead,
} from '@/app/components/icons/OpenReadIcon';

const Notifications = () => {
  const showToast = useToastContext();
  const { userId } = useAppContext();
  const [notifications, setNotifications] = useState<ExtendedNotification[]>(
    []
  );

  useEffect(() => {
    const fetchNotification = async () => {
      if (!userId) return;
      const { notificationsWithReadFlag } =
        await NotificationService.fetchAllNotifications(userId);
      setNotifications(notificationsWithReadFlag);
    };
    fetchNotification();
  }, [userId]);

  const color = (type: string = '') => {
    switch (type) {
      case 'all':
        return 'bg-gray-400';
      case 'individual':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!userId) return;
    await ReadNotificationService.createReadNotification(userId, id);
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    showToast('お知らせを既読にしました', 'success');
  };

  return (
    <div className="container mx-auto py-8 max-w-screen-md">
      <h1 className="text-3xl font-bold mb-6">お知らせ一覧</h1>
      <div className="grid gap-4">
        {notifications.length === 0 && (
          <div>
            <p>お知らせはありません</p>
          </div>
        )}
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex justify-between p-4 rounded shadow-md text-white ${color(
              notification.type
            )}`}
          >
            {notification.message}
            <span className="text-red-500">
              {notification.isRead ? (
                <button className="px-2 py-1 rounded ">
                  <OpenReadIconRead />
                </button>
              ) : (
                <button
                  className="bg-blue-700 border-black text-white px-2 py-1 rounded "
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <OpenReadIcon />
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
