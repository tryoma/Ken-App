import { MouseEvent, useEffect, useState } from 'react';
import { AdviceRequest, TrainingRecord, User } from '@/type';
import { extractYoutubeVideoId } from '@/util/logic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResponceFormSchema } from '@/validationSchema';
import { useAppContext } from '@/context/AppContext';
import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ExecTrainerCommentService } from '@/service/useCase/crossDomain/exec-trainer-comment.service';

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

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative bg-white p-5 border shadow-lg rounded-md w-full md:w-2/5 max-h-full overflow-y-auto max-w-screen-sm text-center">
        <div className="flex flex-col items-center">
          {selectTrainer && (
            <div className="text-xl">{selectTrainer.name}さんからの依頼</div>
          )}
          {selectTrainingRecord && (
            <div className="my-2 w-full">
              <div>{selectTrainingRecord.title}</div>
              <div className="">
                {selectTrainingRecord.videoUrl ? (
                  // selectedRecordにvideoUrlがあれば、その動画を表示
                  <video className="w-full h-52" controls>
                    <source
                      src={selectTrainingRecord.videoUrl}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYoutubeVideoId(
                      selectTrainingRecord.youtubeUrl || ''
                    )}`}
                    title="YouTube video player"
                    className="w-full h-80"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default AdviceRequestCommentModal;
