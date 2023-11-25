import { DocumentSnapshot } from 'firebase/firestore';
import { TrainingRecordService } from '../training-record.service';
import { FavoriteTrainingRecordService } from '../favorite-training-record.service';
import { ExtendedTrainingRecord } from '@/type';

export const fetchTrainingRecordListForPublicWithFavoriteService = {
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
      await TrainingRecordService.fetchTrainingRecordListForPublic(
        pageLimit,
        lastDoc,
        userId
      );

    const trainingRecordListForPublicWithFavorite = trainingRecordList.map(
      record => {
        return {
          ...record,
          isFavorite: favoriteIds.includes(record.id),
        } as ExtendedTrainingRecord;
      }
    );

    return {
      trainingRecordList: trainingRecordListForPublicWithFavorite,
      lastDocument,
    };
  },
};
