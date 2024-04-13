import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Comment, ExtendedTrainingRecord, TrainingRecord } from '@/type';
import TeacherCommentList from './parts/TeacherCommentList';
import { CommentService } from '@/service/useCase/comment.service';
import { FavoriteTrainingRecordService } from '@/service/useCase/favorite-training-record.service';
import { TrainingRecordService } from '@/service/useCase/training-record.service';
import TrainingRecordVideo from './parts/TrainingRecordVideo';
import DefaultModal from './DefaultModal';
import { FavoriteOffIcon, FavoriteOnIcon } from '../icons/FavoriteIcon';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import SubmitIcon from '../icons/SubmitIcon';

interface Props {
  trainingRecord: ExtendedTrainingRecord;
  onModalClose: () => void;
  onRequest: (trainingRecord: TrainingRecord) => void;
  onEditRequest?: (trainingRecord: TrainingRecord) => void;
  onDeleteRequest?: (trainingRecord: TrainingRecord) => Promise<void>;
  isExistRequest?: boolean;
  isCanEdit?: boolean;
  isCanDelete?: boolean;
}

const TrainingRecordDetailModal = ({
  trainingRecord,
  onModalClose,
  onRequest,
  onEditRequest,
  onDeleteRequest,
  isExistRequest,
  isCanEdit = false,
  isCanDelete = false,
}: Props) => {
  const { userId } = useAppContext();
  const [isFavorite, setIsFavorite] = useState<boolean>(
    trainingRecord.isFavorite ?? false
  );
  const [newComment, setNewComment] = useState('');
  const [teacherComments, setTeacherComments] = useState<Comment[]>([]);
  const [publicComments, setPublicComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!trainingRecord.id) return;

    const unsubscribe = CommentService.fetchCommentListSubscribe(
      trainingRecord.id,
      comments => {
        const newTeacherComments: Comment[] = [];
        const newPublicComments: Comment[] = [];

        comments.forEach(comment => {
          if (comment.isTrainer) {
            newTeacherComments.push(comment);
          } else {
            newPublicComments.push(comment);
          }
        });

        setTeacherComments(newTeacherComments);
        setPublicComments(newPublicComments);
      }
    );

    return () => unsubscribe();
  }, [trainingRecord]);

  useEffect(() => {
    const updateWatchCount = async () => {
      await TrainingRecordService.updateWatchCountTrainingRecord(
        trainingRecord.id
      );
    };
    updateWatchCount();
  }, [trainingRecord]);

  const handleAddComment = async () => {
    if (!userId) return;
    if (newComment.trim() !== '') {
      await CommentService.createComment(trainingRecord.id, userId, newComment);
      setNewComment('');
    }
  };

  const handleRequest = async () => {
    const isConfirmed = window.confirm('本当に依頼しますか？');

    // ユーザーが確認ボタンをクリックした場合
    if (isConfirmed) {
      await onRequest(trainingRecord);
      onModalClose();
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('本当に削除しますか？');

    // ユーザーが確認ボタンをクリックした場合
    if (isConfirmed) {
      await onDeleteRequest?.(trainingRecord);
      onModalClose();
    }
  };

  const handleFavorite = async () => {
    if (!userId) return;
    await FavoriteTrainingRecordService.toggleFavoriteTrainingRecord(
      trainingRecord.id,
      userId
    );
    setIsFavorite(!isFavorite);
  };

  return (
    <DefaultModal onCloseModal={onModalClose}>
      <>
        <TrainingRecordVideo trainingRecord={trainingRecord} />
        <div className="flex justify-center space-x-4 pt-2">
          {isExistRequest && (
            <button
              className="py-1 px-2 bg-blue-500 text-white rounded"
              onClick={handleRequest}
            >
              依頼する
            </button>
          )}
          <button
            className={`py-1 px-2 text-white bg-white rounded border 	
            border-gray-400`}
            onClick={handleFavorite}
          >
            {isFavorite ? <FavoriteOnIcon /> : <FavoriteOffIcon />}
          </button>
          {isCanEdit && (
            <button
              className="py-1 px-2 bg-gray-500 text-white rounded"
              onClick={() => onEditRequest?.(trainingRecord)}
            >
              <EditIcon />
            </button>
          )}
          {isCanDelete && (
            <button
              className="py-1 px-2 bg-red-500 text-white rounded"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </button>
          )}
        </div>
        <div className="flex flex-col mt-3">
          <TeacherCommentList comments={teacherComments} />
          <div className="max-h-72 overflow-y-auto mt-4">
            <h2 className="text-xl font-bold mb-3">公開コメント</h2>
            <div className="mt-4">
              <textarea
                className="resize-none border rounded-md p-2 w-full"
                placeholder="新しいコメントを追加"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="py-2 px-4 bg-blue-500 text-white rounded flex items-center justify-center space-x-2"
                  onClick={handleAddComment}
                >
                  投稿
                  <SubmitIcon />
                </button>
              </div>
            </div>
            <div className="mt-1">
              {publicComments.map(comment => (
                <div
                  key={comment.id}
                  className="flex justify-between bg-gray-200 rounded-md mb-2 p-3"
                >
                  <p className="text-gray-800">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </DefaultModal>
  );
};

export default TrainingRecordDetailModal;
