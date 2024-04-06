import { AdviceRequest, Comment } from '@/type';
import { CommentRepository } from '../repository';

export const CommentService = {
  fetchCommentList: async (trainingRecordId: string) => {
    return await CommentRepository.fetchCommentList(trainingRecordId);
  },
  fetchCommentListSubscribe: (
    trainingRecordId: string,
    onCommentsUpdate: (comments: Comment[]) => void
  ) => {
    return CommentRepository.fetchCommentListSubscribe(
      trainingRecordId,
      onCommentsUpdate
    );
  },
  createComment: async (
    trainingRecordId: string,
    userId: string,
    comment: string
  ) => {
    return await CommentRepository.createComment(
      trainingRecordId,
      userId,
      comment
    );
  },
  createTrainerComment: async (
    adviceRequest: AdviceRequest,
    comment: string
  ) => {
    return await CommentRepository.createTrainerComment(adviceRequest, comment);
  },
};
