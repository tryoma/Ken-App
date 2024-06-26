'use client';

import { AdviceRequest, User } from '@/type';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import TrainerModal from '@/app/components/Modal/TrainerModal';
import { useRouter } from 'next/navigation';
import TrainerCardList from '@/app/components/trainer/TrainerCardList';
import { UserService } from '@/service/useCase/user.service';
import { FetchLatestAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-latest-advice-request-entities.service';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';
import TrainingRecordTitle from '@/app/components/Modal/parts/TrainingRecordTitle';
import { useToastContext } from '@/context/ToastContext';

const Trainers = () => {
  const router = useRouter();
  const showToast = useToastContext();
  const { userId } = useAppContext();
  const [preparingAdviceRequest, setPreparingAdviceRequest] =
    useState<AdviceRequest | null>(null);

  const [trainers, setTrainers] = useState<User[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { trainers } = await UserService.fetchTrainers(userId);
      setTrainers(trainers);

      const { adviceRequest, trainingRecord } =
        await FetchLatestAdviceRequestEntitiesService.fetch(userId);
      if (adviceRequest && trainingRecord) {
        setPreparingAdviceRequest(adviceRequest);
      }
    };
    fetchData();
  }, [userId]);

  const onTrainingRecordRequest = async (trainer: User) => {
    if (!userId) return;
    if (preparingAdviceRequest) {
      await AdviceRequestService.updateAdviceRequest(
        preparingAdviceRequest.id,
        {
          status: 'prepared',
          trainerUserId: trainer.id,
        }
      );
      showToast('アドバイス依頼を仮作成しました', 'success');
      router.push('/private/general/dashboard/advice-requests');
    } else {
      await AdviceRequestService.createAdviceRequest(userId, trainer.id, '');
      showToast('トレーナーを選択しました', 'success');
      router.push('/private/general/dashboard/my-training-records');
    }
  };

  const handleTrainerClick = (trainer: User) => {
    setSelectedTrainer(trainer);
    document.body.style.overflow = 'hidden';
  };

  const onModalClose = () => {
    setSelectedTrainer(null);
    document.body.style.overflow = '';
  };

  const onDeleteAdviceRequest = async () => {
    if (!preparingAdviceRequest) return;
    await AdviceRequestService.updateAdviceRequest(preparingAdviceRequest.id, {
      status: 'deleted',
    });
    showToast('アドバイス依頼を取り消しました', 'success');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">トレーナー一覧</h1>
      {preparingAdviceRequest && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="flex items-center font-bold">
            アドバイス依頼(動画選択中)
            <button
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={onDeleteAdviceRequest}
            >
              取消
            </button>
          </p>
          <div className="flex">
            <p className="mr-2">選択中の動画タイトル:</p>
            <span className="">
              <TrainingRecordTitle
                trainingRecordId={preparingAdviceRequest.trainingRecordId}
              />
            </span>
          </div>
          <p>依頼するユーザーを選択してください。</p>
        </div>
      )}

      {trainers.length === 0 ? (
        <p>トレーナーが見つかりませんでした。</p>
      ) : (
        <TrainerCardList trainerList={trainers} onSelect={handleTrainerClick} />
      )}

      {selectedTrainer && userId && (
        <TrainerModal
          trainer={selectedTrainer}
          onModalClose={onModalClose}
          onRequest={onTrainingRecordRequest}
        />
      )}
    </div>
  );
};

export default Trainers;
