import {
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { PointHistory } from '@/type';

export const PointHistoryRepository = {
  createPointHistory: async (pointHistory: Omit<PointHistory, 'id'>) => {
    const docRef = doc(collection(db, 'PointHistories'));
    const newPointHistory = {
      ...pointHistory,
      createdAt: Timestamp.now(),
    };
    await setDoc(docRef, newPointHistory);
  },

  fetchPointHistoryList: async (
    userId: string,
    limitCount: number,
    lastVisible: QueryDocumentSnapshot | null
  ): Promise<{
    histories: PointHistory[];
    next: QueryDocumentSnapshot | null;
  }> => {
    const GET_COUNT = limitCount + 1;
    const pointHistoriesRef = collection(db, 'PointHistories');
    const q = lastVisible
      ? query(
          pointHistoriesRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          startAt(lastVisible),
          limit(GET_COUNT)
        )
      : query(
          pointHistoriesRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(GET_COUNT)
        );
    const querySnapshot = await getDocs(q);
    const histories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PointHistory[];
    const next =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;

    return { histories, next };
  },
};
