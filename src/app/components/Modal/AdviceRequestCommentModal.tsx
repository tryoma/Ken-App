import { useEffect, useState } from 'react';
import { AdviceRequest, TrainingRecord, User } from '@/type';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResponceFormSchema } from '@/validationSchema';
import { useAppContext } from '@/context/AppContext';
import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ExecTrainerCommentService } from '@/service/useCase/crossDomain/exec-trainer-comment.service';
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
  const { setSettingChangeFlag, settingChangeFlag } = useAppContext();
  const [selectTrainer, setSelectTrainer] = useState<User | null>(null);
  const [selectTrainingRecord, setSelectTrainingRecord] =
    useState<TrainingRecord | null>(null);

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
      const { user, trainingRecord } =
        await FetchAdviceRequestEntitiesService.fetch(selectedAdviceRequest);
      setSelectTrainer(user);
      setSelectTrainingRecord(trainingRecord);
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
    setSettingChangeFlag(!settingChangeFlag);
    onClose();
  };

  return (
    <DefaultModal onCloseModal={onClose}>
      <div className="flex flex-col items-center">
        {selectTrainer && (
          <div className="text-xl">{selectTrainer.name}さんからの依頼</div>
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
            {selectedAdviceRequest.focusPoint}
          </div>
          {/* コメント入力フォーム */}
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
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit(handleComment)}
            className="py-2 px-4 bg-blue-500 text-white rounded mt-4"
          >
            投稿する
          </button>
        </div>
      </div>
    </DefaultModal>
  );
};

export default AdviceRequestCommentModal;
