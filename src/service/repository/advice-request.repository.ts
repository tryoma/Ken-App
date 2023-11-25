import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { AdviceRequest, AdviceStatus } from '@/type';
import { db } from '../../../firebase';

export const AdviceRequestRepository = {
  createAdviceRequest: async (
    userId: string,
    trainerUserId: string,
    trainingRecordId: string
  ) => {
    const adviceRequest: Omit<AdviceRequest, 'id'> = {
      userId,
      trainerUserId,
      trainingRecordId,
      status: 'pending',
    };
    const docRef = doc(collection(db, 'AdviceRequests'));
    await setDoc(docRef, adviceRequest);
  },

  updateAdviceRequest: async (
    adviceRequestId: string,
    data: Partial<AdviceRequest>
  ) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    const adviceRequestRef = doc(db, 'AdviceRequests', adviceRequestId);
    await setDoc(adviceRequestRef, cleanedData, { merge: true });
  },

  fetchAdviceRequest: async (adviceRequestId: string) => {
    const docRef = doc(db, 'AdviceRequests', adviceRequestId);
    const docSnap = await getDoc(docRef);
    const adviceRequest = docSnap.exists() ? docSnap.data() : null;
    return adviceRequest;
  },

  fetchLatestPendingAdviceRequest: async (userId: string) => {
    const adviceRequestsRef = collection(db, 'AdviceRequests');
    const querySnapshot = await getDocs(
      query(
        adviceRequestsRef,
        where('userId', '==', userId),
        where('status', '==', 'pending')
      )
    );

    const latestAdviceRequest = querySnapshot.docs[0];

    return latestAdviceRequest
      ? ({
          id: latestAdviceRequest.id,
          ...latestAdviceRequest.data(),
        } as AdviceRequest)
      : null;
  },

  fetchAdviceRequestList: async (userId: string, status: AdviceStatus) => {
    const adviceRequestsRef = collection(db, 'AdviceRequests');
    const querySnapshot = await getDocs(
      query(
        adviceRequestsRef,
        where('userId', '==', userId),
        where('status', '==', status)
      )
    );
    const adviceRequests = querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AdviceRequest)
    );

    return { adviceRequests };
  },

  fetchAdviceRequestsCount: async (userId: string, status: AdviceStatus) => {
    const adviceRequestsRef = collection(db, 'AdviceRequests');
    const querySnapshot = await getDocs(
      query(
        adviceRequestsRef,
        where('userId', '==', userId),
        where('status', '==', status)
      )
    );

    return querySnapshot.docs.length;
  },

  fetchAdviceRequestListForMe: async (
    trainerUserId: string,
    status: AdviceStatus
  ) => {
    const adviceRequestsRef = collection(db, 'AdviceRequests');
    const querySnapshot = await getDocs(
      query(
        adviceRequestsRef,
        where('trainerUserId', '==', trainerUserId),
        where('status', '==', status)
      )
    );
    const adviceRequests = querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AdviceRequest)
    );

    return { adviceRequests };
  },

  fetchAdviceRequestsForMeCount: async (
    trainerUserId: string,
    status: AdviceStatus
  ) => {
    const adviceRequestsRef = collection(db, 'AdviceRequests');
    const querySnapshot = await getDocs(
      query(
        adviceRequestsRef,
        where('trainerUserId', '==', trainerUserId),
        where('status', '==', status)
      )
    );

    return querySnapshot.docs.length;
  },
};
