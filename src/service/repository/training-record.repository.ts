import { TrainingRecord, TrainingRecordFormValues } from '@/type';
import {
  DocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';

export const TrainingRecordRepository = {
  fetchTrainingRecordListForMe: async (
    userId: string,
    pageLimit: number,
    lastDoc: DocumentSnapshot | null
  ): Promise<{
    trainingRecordList: TrainingRecord[];
    lastDocument: DocumentSnapshot | null;
  }> => {
    const recordsRef = collection(db, 'TrainingRecords');
    let q = query(
      recordsRef,
      where('userId', '==', userId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    if (lastDoc) {
      q = query(
        recordsRef,
        where('userId', '==', userId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
        limit(pageLimit),
        startAfter(lastDoc)
      );
    }

    const trainingRecordsSnapshot = await getDocs(q);
    const trainingRecordList: TrainingRecord[] =
      trainingRecordsSnapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
            date: doc.data().date.toDate(),
          } as TrainingRecord)
      );

    return {
      trainingRecordList,
      lastDocument:
        trainingRecordsSnapshot.docs[trainingRecordsSnapshot.docs.length - 1],
    };
  },

  fetchTrainingRecordListForFavorite: async (
    favoriteIds: string[],
    pageLimit: number,
    lastDoc: DocumentSnapshot | null
  ): Promise<{
    trainingRecordList: TrainingRecord[];
    lastDocument: DocumentSnapshot | null;
  }> => {
    if (favoriteIds.length === 0) {
      return { trainingRecordList: [], lastDocument: null };
    }
    const recordsRef = collection(db, 'TrainingRecords');
    let queryCondition = query(
      recordsRef,
      where('id', 'in', favoriteIds),
      where('isDeleted', '==', false),
      limit(6)
    );

    if (lastDoc) {
      queryCondition = query(
        recordsRef,
        where('id', 'in', favoriteIds),
        where('isDeleted', '==', false),
        limit(6),
        startAfter(lastDoc)
      );
    }

    const trainingRecordsSnapshot = await getDocs(queryCondition);
    const trainingRecordList: TrainingRecord[] =
      trainingRecordsSnapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
            date: doc.data().date.toDate(),
          } as TrainingRecord)
      );

    return {
      trainingRecordList,
      lastDocument:
        trainingRecordsSnapshot.docs[trainingRecordsSnapshot.docs.length - 1],
    };
  },

  fetchTrainingRecordsForPublic: async (
    pageLimit: number,
    lastDoc: DocumentSnapshot | null,
    excludedUserId?: string
  ): Promise<{
    trainingRecordList: TrainingRecord[];
    lastDocument: DocumentSnapshot | null;
  }> => {
    const recordsRef = collection(db, 'TrainingRecords');
    let queryCondition = excludedUserId
      ? query(
          recordsRef,
          where('userId', '!=', excludedUserId),
          where('isDeleted', '==', false),
          limit(6)
        )
      : query(recordsRef, where('isDeleted', '==', false), limit(pageLimit));

    if (lastDoc) {
      queryCondition = excludedUserId
        ? query(
            recordsRef,
            where('userId', '!=', excludedUserId),
            where('isDeleted', '==', false),
            limit(6),
            startAfter(lastDoc)
          )
        : query(
            recordsRef,
            where('isDeleted', '==', false),
            limit(pageLimit),
            startAfter(lastDoc)
          );
    }

    const trainingRecordsSnapshot = await getDocs(queryCondition);
    const trainingRecordList: TrainingRecord[] =
      trainingRecordsSnapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
            date: doc.data().date.toDate(),
          } as TrainingRecord)
      );

    return {
      trainingRecordList,
      lastDocument:
        trainingRecordsSnapshot.docs[trainingRecordsSnapshot.docs.length - 1],
    };
  },

  createTrainingRecord: async (
    userId: string,
    data: TrainingRecordFormValues
  ): Promise<void> => {
    const docRef = doc(collection(db, 'TrainingRecords'));
    const trainingRecord: TrainingRecord = {
      id: docRef.id,
      userId,
      title: data.title,
      date: data.date ? new Date(data.date) : new Date(),
      withWho: data.withWho,
      memo: data.memo,
      isPublic: data.isPublic === 'true',
      youtubeUrl: data.youtubeUrl || '',
      videoUrl: data.videoUrl || '',
      commonKey: data.commonKey || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isDeleted: false,
      watchCount: 0,
    };
    await setDoc(docRef, trainingRecord);
  },

  updateTrainingRecord: async (
    trainingRecordId: string,
    data: TrainingRecordFormValues
  ): Promise<void> => {
    const recordRef = doc(db, 'TrainingRecords', trainingRecordId);
    const trainingRecord: Partial<TrainingRecord> = {
      title: data.title,
      date: data.date ? new Date(data.date) : new Date(),
      withWho: data.withWho,
      memo: data.memo,
      isPublic: data.isPublic === 'true',
      updatedAt: Timestamp.now(),
    };
    await setDoc(recordRef, trainingRecord, { merge: true });
  },

  deleteTrainingRecord: async (trainingRecordId: string): Promise<void> => {
    const recordRef = doc(db, 'TrainingRecords', trainingRecordId);
    const trainingRecord: Partial<TrainingRecord> = {
      isDeleted: true,
      updatedAt: Timestamp.now(),
    };
    await setDoc(recordRef, trainingRecord, { merge: true });
  },

  updateWatchCountTrainingRecord: async (
    trainingRecordId: string
  ): Promise<void> => {
    const recordRef = doc(db, 'TrainingRecords', trainingRecordId);

    await updateDoc(recordRef, { watchCount: increment(1) });
  },

  fetchTrainingRecord: async (
    trainingRecordId: string
  ): Promise<TrainingRecord | null> => {
    const recordRef = doc(db, 'TrainingRecords', trainingRecordId);
    const recordDocSnapshot = await getDoc(recordRef);
    const recordData = recordDocSnapshot.exists()
      ? recordDocSnapshot.data()
      : null;
    const record = {
      ...recordData,
      date: recordData?.date.toDate(),
    } as TrainingRecord;
    return record;
  },
};
