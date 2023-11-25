import { DocumentSnapshot } from 'firebase/firestore';
import { TrainingRecordService } from '../training-record.service';
import { FavoriteTrainingRecordService } from '../favorite-training-record.service';
import { ExtendedTrainingRecord } from '@/type';

export const fetchTrainingRecordListForFavoriteWithFavoriteService = {
  fetch: async (
    userId: string,
    pageLimit: number,
    lastDoc: DocumentSnapshot | null
  ) => {
    const favoriteIds =
      await FavoriteTrainingRecordService.fetchFavoriteTrainingRecordIds(
        userId
      );
    const { trainingRecordList, lastDocument } =
      await TrainingRecordService.fetchTrainingRecordListForFavorite(
        favoriteIds,
        pageLimit,
        lastDoc
      );

    const trainingRecordListWithFavorite = trainingRecordList.map(record => {
      return {
        ...record,
        isFavorite: favoriteIds.includes(record.id),
      } as ExtendedTrainingRecord;
    });

    return { trainingRecordList: trainingRecordListWithFavorite, lastDocument };
  },
};
