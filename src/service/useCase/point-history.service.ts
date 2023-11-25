import { PointHistory } from '@/type';
import { PointHistoryRepository } from '../repository';

export const PointHistoryService = {
  createPointHistory: async (pointHistory: Omit<PointHistory, 'id'>) => {
    await PointHistoryRepository.createPointHistory(pointHistory);
  },

  fetchPointHistoryList: async (userId: string): Promise<PointHistory[]> => {
    return await PointHistoryRepository.fetchPointHistoryList(userId);
  },
};
