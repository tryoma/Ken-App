// ReadNotificationRepository.ts
import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export const ReadNotificationRepository = {
  create: async (userId: string, notificationId: string) => {
    const readNotificationRef = doc(collection(db, 'ReadNotifications'));
    const newReadNotification = {
      userId,
      notificationId,
      createdAt: Timestamp.now(),
    };
    await setDoc(readNotificationRef, newReadNotification);
  },
};
