// NotificationService.ts
import { ExtendedNotification } from '@/type';
import { NotificationRepository } from '../repository';

export const NotificationService = {
  fetchAllNotifications: async (userId: string) => {
    const allNotifications =
      await NotificationRepository.fetchNotificationsByType('all', null);
    const individualNotifications =
      await NotificationRepository.fetchNotificationsByType(
        'individual',
        userId
      );

    const combinedNotifications = [
      ...allNotifications,
      ...individualNotifications,
    ];
    const readNotificationIds =
      await NotificationRepository.fetchReadNotificationIds(userId);

    const notificationsWithReadFlag: ExtendedNotification[] =
      combinedNotifications.map(notification => ({
        ...notification,
        isRead: readNotificationIds.includes(notification.id),
      }));

    return { notificationsWithReadFlag };
  },

  fetchNotificationsCount: async (userId: string) => {
    const allNotifications =
      await NotificationRepository.fetchNotificationsByType('all', null);
    const individualNotifications =
      await NotificationRepository.fetchNotificationsByType(
        'individual',
        userId
      );

    const combinedNotifications = [
      ...allNotifications,
      ...individualNotifications,
    ];
    const readNotificationIds =
      await NotificationRepository.fetchReadNotificationIds(userId);

    return combinedNotifications.length - readNotificationIds.length;
  },
};
