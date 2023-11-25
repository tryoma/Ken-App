import { ReadNotificationRepository } from '../repository';

export const ReadNotificationService = {
  createReadNotification: async (userId: string, notificationId: string) => {
    await ReadNotificationRepository.create(userId, notificationId);
  },
};
