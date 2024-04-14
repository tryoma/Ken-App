import { PointHistory } from '@/type';
import { PointHistoryRepository } from '../repository';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export const PointHistoryService = {
  createPointHistory: async (pointHistory: Omit<PointHistory, 'id'>) => {
    await PointHistoryRepository.createPointHistory(pointHistory);
  },

  fetchPointHistoryList: async (
    userId: string,
    limitCount: number,
    lastVisible: QueryDocumentSnapshot | null
  ): Promise<{
    histories: PointHistory[];
    next: QueryDocumentSnapshot | null;
  }> => {
    return await PointHistoryRepository.fetchPointHistoryList(
      userId,
      limitCount,
      lastVisible
    );
  },
};
