import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { withTryCatch } from '@/util/withTryCatch';

export const FavoriteTrainingRecordRepository = {
  fetchFavoriteTrainingRecordListIds: withTryCatch(
    async (userId: string): Promise<string[]> => {
      const favoriteRecordsRef = collection(db, 'FavoriteTrainingRecords');
      const favoriteRecordsQuery = query(
        favoriteRecordsRef,
        where('userId', '==', userId)
      );
      const favoriteRecordsSnapshot = await getDocs(favoriteRecordsQuery);
      return favoriteRecordsSnapshot.docs.map(
        doc => doc.data().trainingRecordId
      );
    }
  ),

  toggleFavoriteTrainingRecord: withTryCatch(
    async (trainingRecordId: string, userId: string): Promise<void> => {
      const favoriteRecordsRef = collection(db, 'FavoriteTrainingRecords');
      const favoriteRecordsQuery = query(
        favoriteRecordsRef,
        where('userId', '==', userId),
        where('trainingRecordId', '==', trainingRecordId)
      );
      const favoriteRecordsSnapshot = await getDocs(favoriteRecordsQuery);
      const favoriteRecords = favoriteRecordsSnapshot.docs;

      if (favoriteRecords.length) {
        await deleteDoc(favoriteRecords[0].ref);
      } else {
        await addDoc(favoriteRecordsRef, {
          userId,
          trainingRecordId,
          createdAt: Timestamp.now(),
        });
      }
    }
  ),
};
