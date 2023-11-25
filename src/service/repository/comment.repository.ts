import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { AdviceRequest, Comment } from '@/type';

export const CommentRepository = {
  fetchCommentList: async (trainingRecordId: string) => {
    const trainingRecordRef = doc(db, 'TrainingRecords', trainingRecordId);
    const commentsRef = collection(trainingRecordRef, 'comments');
    const querySnapshot = await getDocs(commentsRef);
    const comments = querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );

    return comments;
  },
  createComment: async (
    trainingRecordId: string,
    userId: string,
    comment: string
  ) => {
    const NewComment: Omit<Comment, 'id'> = {
      text: comment,
      userId,
      isTrainer: false,
      createdAt: Timestamp.now(),
    };
    const trainigRecordRef = doc(
      collection(db, 'TrainingRecords'),
      trainingRecordId
    );
    const commentsRef = collection(trainigRecordRef, 'comments');
    await addDoc(commentsRef, NewComment);
  },

  createTrainerComment: async (
    adviceRequest: AdviceRequest,
    comment: string
  ) => {
    const NewComment: Omit<Comment, 'id'> = {
      text: comment,
      userId: adviceRequest.trainerUserId || '',
      isTrainer: true,
      focusPoint: adviceRequest.focusPoint,
      adviceRequestId: adviceRequest.id,
      createdAt: Timestamp.now(),
    };
    const trainigRecordRef = doc(
      collection(db, 'TrainingRecords'),
      adviceRequest.trainingRecordId
    );
    const commentsRef = collection(trainigRecordRef, 'comments');

    await addDoc(commentsRef, NewComment);
  },
};
