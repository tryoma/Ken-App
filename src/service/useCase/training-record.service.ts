import { ExtendedTrainingRecord, TrainingRecordFormValues } from '@/type';
import {
  FavoriteTrainingRecordRepository,
  TrainingRecordRepository,
} from '../repository';
import { DocumentSnapshot } from 'firebase/firestore';

export const TrainingRecordService = {
  fetchTrainingRecordListForMe: async (
    userId: string,
    pageLimit: number,
    lastDoc: DocumentSnapshot | null
  ) => {
    return await TrainingRecordRepository.fetchTrainingRecordListForMe(
      userId,
      pageLimit,
      lastDoc
    );
  },

  fetchTrainingRecordListForFavorite: async (
    favoriteIds: string[],
    pageLimit: number,
    lastDoc: DocumentSnapshot | null
  ) => {
    return await TrainingRecordRepository.fetchTrainingRecordListForFavorite(
      favoriteIds,
      pageLimit,
      lastDoc
    );
  },

  fetchTrainingRecordListForPublic: async (
    pageLimit: number,
    lastDoc: DocumentSnapshot | null,
    userId: string
  ) => {
    return await TrainingRecordRepository.fetchTrainingRecordsForPublic(
      pageLimit,
      lastDoc,
      userId
    );
  },

  createTrainingRecord: async (
    userId: string,
    data: TrainingRecordFormValues
  ) => {
    return await TrainingRecordRepository.createTrainingRecord(userId, data);
  },

  updateTrainingRecord: async (
    trainingRecordId: string,
    data: TrainingRecordFormValues
  ) => {
    return await TrainingRecordRepository.updateTrainingRecord(
      trainingRecordId,
      data
    );
  },

  deleteTrainingRecord: async (trainingRecordId: string) => {
    return await TrainingRecordRepository.deleteTrainingRecord(
      trainingRecordId
    );
  },

  fetchTrainingRecord: async (trainingRecordId: string) => {
    return await TrainingRecordRepository.fetchTrainingRecord(trainingRecordId);
  },

  updateWatchCountTrainingRecord: async (trainingRecordId: string) => {
    return await TrainingRecordRepository.updateWatchCountTrainingRecord(
      trainingRecordId
    );
  },
};
