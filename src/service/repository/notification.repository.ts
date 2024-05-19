import { Notification, NotificationType } from '@/type';
import { db } from '../../../firebase';
import {
  collection,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export const NotificationRepository = {
  fetchNotificationsByType: async (
    type: NotificationType,
    userId: string | null
  ) => {
    const notificationsRef = collection(db, 'Notifications');
    let notificationsQuery = query(notificationsRef, where('type', '==', type));

    if (type === 'individual' && userId) {
      notificationsQuery = query(
        notificationsQuery,
        where('userId', '==', userId)
      );
    }

    const snapshot = await getDocs(notificationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  fetchReadNotificationIds: async (userId: string) => {
    const readNotificationsRef = collection(db, 'ReadNotifications');
    const readQuery = query(
      readNotificationsRef,
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(readQuery);
    return snapshot.docs.map(doc => doc.data().notificationId);
  },

  fetchNotificationsSubscribe: (
    onNotifications: (notifications: Notification[]) => void
  ) => {
    const notificationsRef = collection(db, 'Notifications');
    const notificationsQuery = query(notificationsRef, orderBy('createdAt'));
    const unsubscribe = onSnapshot(notificationsQuery, snapshot => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      onNotifications(notifications);
    });

    return unsubscribe;
  },
};
