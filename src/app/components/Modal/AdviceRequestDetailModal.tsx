import { FetchAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-advice-request-entities.service';
import { ProcessAdviceRequestService } from '@/service/useCase/crossDomain/process-advice-request.service';
import { AdviceRequest, Comment, TrainingRecord, User } from '@/type';
import { RequestFormSchema } from '@/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TrainingRecordVideo from './parts/TrainingRecordVideo';
import DefaultModal from './DefaultModal';
import { CommentService } from '@/service/useCase/comment.service';
import { formatLastTime } from '@/util/logic';

interface Props {
  selectedAdviceRequest: AdviceRequest;
  onModalClose: () => void;
}

const AdviceRequestDetailModal = ({
  selectedAdviceRequest,
  onModalClose,
}: Props) => {
  const [selectTrainer, setSelectTrainer] = useState<User | null>(null);
  const [teacherComment, setTeacherComment] = useState<Comment | null>(null);
  const { status, focusPoint, trainingRecordId, limitTime } =
    selectedAdviceRequest;
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
      if (!trainingRecordId) return;
      const comment = await CommentService.fetchComment(
        trainingRecordId,
        selectedAdviceRequest.id
      );
      setTeacherComment(comment);
    };
    fetchData();
  }, [selectedAdviceRequest, trainingRecordId]);

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
    onModalClose();
  };

  return (
    <DefaultModal onCloseModal={onModalClose}>
      <div className="">
        {selectTrainer && (
          <div className="text-center">
            <div className="text-xl">{selectTrainer.name} さんへの依頼</div>
            {status === 'prepared' && (
              <div className="text-xs text-gray-500">
                (※{selectTrainer.requestPoint} P必要)
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
          {status === 'prepared' ? (
            <>
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
              <div className="text-center">
                <button
                  onClick={handleSubmit(onRequestAdvice)}
                  className="py-2 px-4 bg-blue-500 text-white rounded"
                >
                  申込
                </button>
              </div>
            </>
          ) : (
            <div className="rounded bg-gray-200 p-2 mt-1 text-sm text-gray-500">
              {focusPoint}
            </div>
          )}
        </div>
        {status === 'requested' && (
          <div className="text-center">
            <p>現在依頼中です。</p>
            <p>期限：{formatLastTime(limitTime)}</p>
          </div>
        )}
        {status === 'accepted' && (
          <div>
            <div className="block text-gray-700 text-sm font-bold mb-2">
              アドバイス
            </div>
            <div className="rounded bg-gray-200 p-2 mt-1 text-sm text-gray-500">
              {teacherComment?.text}
            </div>
          </div>
        )}
        {status === 'rejected' && (
          <div className="text-center text-red-300">
            <p>回答頂けませんでしたので、</p>
            <p>キャンセルされました。</p>
          </div>
        )}
      </div>
    </DefaultModal>
  );
};

export default AdviceRequestDetailModal;
