import { useAppContext } from '@/context/AppContext';
import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ProcessAdviceRequestService } from '@/service/useCase/crossDomain/process-advice-request.service';
import { AdviceRequest, TrainingRecord, User } from '@/type';
import { RequestFormSchema } from '@/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TrainingRecordVideo from './parts/TrainingRecordVideo';
import DefaultModal from './DefaultModal';

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
    <DefaultModal onCloseModal={onModalClose}>
      <div className="">
        {selectTrainer && (
          <div className="text-center">
            <div className="text-xl">{selectTrainer.name} さんへの依頼</div>
            <div className="text-xs text-gray-500">
              (※{selectTrainer.requestPoint} P必要)
            </div>
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
    </DefaultModal>
  );
};

export default AdviceRequestDetailModal;
