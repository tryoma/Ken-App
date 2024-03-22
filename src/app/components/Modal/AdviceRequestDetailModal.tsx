import { useAppContext } from '@/context/AppContext';
import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ProcessAdviceRequestService } from '@/service/useCase/crossDomain/process-advice-request.service';
import { AdviceRequest, TrainingRecord, User } from '@/type';
import { extractYoutubeVideoId } from '@/util/logic';
import { RequestFormSchema } from '@/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  selectedAdviceRequest: AdviceRequest | null;
  onModalClose: () => void;
}

const AdviceRequestDetailModal = ({
  selectedAdviceRequest,
  onModalClose,
}: Props) => {
  const { setSettingChangeFlag, settingChangeFlag } = useAppContext();
  const [selectTrainer, setSelectTrainer] = useState<User | null>(null);
  const [selectTrainingRecord, setSelectTrainingRecord] =
    useState<TrainingRecord | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ focusPoint: string }>({
    mode: 'all',
    defaultValues: {
      focusPoint: '',
    },
    resolver: yupResolver(RequestFormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAdviceRequest) return;
      const { trainerUser, trainingRecord } =
        await FetchAdviceRequestEntitiesService.fetch(selectedAdviceRequest);
      setSelectTrainer(trainerUser);
      setSelectTrainingRecord(trainingRecord);
    };
    fetchData();
  }, [selectedAdviceRequest]);

  if (!selectedAdviceRequest) {
    return null;
  }

  const onRequestAdvice = async ({ focusPoint }: { focusPoint: string }) => {
    if (!selectedAdviceRequest) return;
    const isOk = window.confirm(`アドバイスを申し込みますか？`);
    if (!isOk) return;
    const { isSuccess, shortage } = await ProcessAdviceRequestService.create(
      selectedAdviceRequest.id,
      focusPoint
    );
    if (!isSuccess) {
      if (shortage != 0) alert(`ポイントが${shortage}P足りません`);
      else alert('アドバイスを申し込めませんでした');
      return;
    }
    alert('アドバイスを申し込みました');
    setSettingChangeFlag(!settingChangeFlag);
    onModalClose();
  };

  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onModalClose();
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
            <>
              <div className="text-xl">{selectTrainer.name} さんへの依頼</div>
              <div className="text-xs text-gray-500">
                (※{selectTrainer.requestPoint} P必要)
              </div>
            </>
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
            <textarea
              id="focusPoint"
              rows={3}
              {...register('focusPoint')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.focusPoint && (
              <span className="text-red-500 text-xs italic">
                {errors.focusPoint.message}
              </span>
            )}
          </div>
          <button
            onClick={handleSubmit(onRequestAdvice)}
            className="py-2 px-4 bg-blue-500 text-white rounded"
          >
            申込
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdviceRequestDetailModal;
