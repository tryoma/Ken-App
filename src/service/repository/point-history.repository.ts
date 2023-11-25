import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
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

  fetchPointHistoryList: async (userId: string): Promise<PointHistory[]> => {
    const pointHistoriesRef = collection(db, 'PointHistories');
    const q = query(pointHistoriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PointHistory[];
  },
};
