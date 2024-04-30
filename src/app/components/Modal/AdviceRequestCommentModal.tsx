import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ResponceFormSchema } from '@/validationSchema';
import { AdviceRequest, Comment, TrainingRecord, User } from '@/type';
import { formatLastTime } from '@/util/logic';
import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ExecTrainerCommentService } from '@/service/useCase/crossDomain/exec-trainer-comment.service';
import { CommentService } from '@/service/useCase/comment.service';
import TrainingRecordVideo from './parts/TrainingRecordVideo';
import DefaultModal from './DefaultModal';

interface Props {
  selectedAdviceRequest: AdviceRequest;
  onClose: () => void;
}

const AdviceRequestCommentModal = ({
  selectedAdviceRequest,
  onClose,
}: Props) => {
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [selectTrainer, setSelectTrainer] = useState<User | null>(null);
  const [selectTrainingRecord, setSelectTrainingRecord] =
    useState<TrainingRecord | null>(null);
  const [teacherComment, setTeacherComment] = useState<Comment | null>(null);
  const { paymentPoint, focusPoint, status, limitTime } = selectedAdviceRequest;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ responceComment: string }>({
    mode: 'all',
    defaultValues: {
      responceComment: '',
    },
    resolver: yupResolver(ResponceFormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAdviceRequest) return;
      const { user, trainerUser, trainingRecord } =
        await FetchAdviceRequestEntitiesService.fetch(selectedAdviceRequest);
      setSelectUser(user);
      setSelectTrainer(trainerUser);
      setSelectTrainingRecord(trainingRecord);
      if (!trainingRecord) return;
      const comment = await CommentService.fetchComment(
        trainingRecord?.id,
        selectedAdviceRequest.id
      );
      setTeacherComment(comment);
    };
    fetchData();
  }, [selectedAdviceRequest]);

  const handleComment = async ({
    responceComment,
  }: {
    responceComment: string;
  }) => {
    await ExecTrainerCommentService.execute(
      selectedAdviceRequest,
      responceComment
    );
    alert('コメントを投稿しました');
    onClose();
  };

  return (
    <DefaultModal onCloseModal={onClose}>
      <div className="flex flex-col">
        {selectUser && (
          <div className="text-center">
            <div className="text-xl">{selectUser.name} さんからの依頼</div>
            {status != 'rejected' && (
              <div className="text-xs text-gray-500">
                (※{paymentPoint} P獲得 {status === 'accepted' && '済'})
              </div>
            )}
            {status === 'requested' && (
              <div className="text-xs text-red-500">
                (※{formatLastTime(limitTime)} までに回答をお願いします)
              </div>
            )}
          </div>
        )}
        <TrainingRecordVideo trainingRecord={selectTrainingRecord} />
        <div className="mb-4 w-full text-left">
          <label
            htmlFor="focusPoint"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            注目してほしいポイント
          </label>
          <div className="text-xs bg-gray-200 rounded-md mb-2 p-3">
            {focusPoint}
          </div>

          {status === 'requested' && (
            <>
              <label
                htmlFor="focusPoint"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                アドバイス
              </label>
              <textarea
                id="responceComment"
                rows={3}
                {...register('responceComment')}
                placeholder="コメントを入力してください"
                className="resize-none border rounded-md p-2 w-full"
              />
              {errors.responceComment && (
                <span className="text-red-500 text-xs italic">
                  {errors.responceComment.message}
                </span>
              )}
              <div className="text-center">
                <button
                  onClick={handleSubmit(handleComment)}
                  className="py-2 px-4 bg-blue-500 text-white rounded mt-4"
                >
                  投稿する
                </button>
              </div>
            </>
          )}
          {status === 'accepted' && teacherComment && (
            <>
              <label
                htmlFor="focusPoint"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                アドバイス({formatLastTime(teacherComment.createdAt)} 回答済み)
              </label>
              <div className="text-xs bg-gray-200 rounded-md mb-2 p-3">
                {teacherComment.text}
              </div>
            </>
          )}
          {status === 'rejected' && (
            <div className="text-center text-red-300">
              <p>回答頂けませんでしたので、</p>
              <p>キャンセルされました。</p>
            </div>
          )}
        </div>
      </div>
    </DefaultModal>
  );
};

export default AdviceRequestCommentModal;
