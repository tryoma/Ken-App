import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Comment, ExtendedTrainingRecord, TrainingRecord } from '@/type';
import TeacherCommentList from './parts/TeacherCommentList';
import { CommentService } from '@/service/useCase/comment.service';
import { FavoriteTrainingRecordService } from '@/service/useCase/favorite-training-record.service';
import { TrainingRecordService } from '@/service/useCase/training-record.service';
import TrainingRecordVideo from './parts/TrainingRecordVideo';
import DefaultModal from './DefaultModal';

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
  const [fetchFlag, setFetchFlag] = useState(false);
  const [teacherComments, setTeacherComments] = useState<Comment[]>([]);
  const [publicComments, setPublicComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const comments = await CommentService.fetchCommentList(trainingRecord.id);
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
    };
    fetchData();
  }, [trainingRecord, fetchFlag]);

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
      setFetchFlag(!fetchFlag);
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
          <button
            className={`py-1 px-2 text-white rounded ${
              isFavorite ? 'bg-gray-500' : 'bg-blue-500'
            }`}
            onClick={handleFavorite}
          >
            お気に入り{isFavorite ? '解除' : '登録'}
          </button>
          {isExistRequest && (
            <button
              className="py-1 px-2 bg-blue-500 text-white rounded"
              onClick={handleRequest}
            >
              この動画を依頼する
            </button>
          )}
          {isCanEdit && (
            <button
              className="py-1 px-2 bg-blue-500 text-white rounded"
              onClick={() => onEditRequest?.(trainingRecord)}
            >
              編集
            </button>
          )}
          {isCanDelete && (
            <button
              className="py-1 px-2 bg-red-500 text-white rounded"
              onClick={handleDelete}
            >
              削除
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
              <div className="text-right">
                <button
                  className="py-2 px-4 bg-blue-500 text-white rounded"
                  onClick={handleAddComment}
                >
                  追加
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
