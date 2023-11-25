import { FavoriteTrainingRecordRepository } from '../repository';

export const FavoriteTrainingRecordService = {
  fetchFavoriteTrainingRecordIds: async (userId: string) => {
    return FavoriteTrainingRecordRepository.fetchFavoriteTrainingRecordListIds(
      userId
    );
  },
  toggleFavoriteTrainingRecord: async (
    trainingRecordId: string,
    userId: string
  ) => {
    return FavoriteTrainingRecordRepository.toggleFavoriteTrainingRecord(
      trainingRecordId,
      userId
    );
  },
};
