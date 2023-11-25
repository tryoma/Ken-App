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

const Trainers = () => {
  const router = useRouter();
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
      router.push('/private/general/dashboard/advice-requests');
    } else {
      await AdviceRequestService.createAdviceRequest(userId, trainer.id, '');
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
          <p>依頼するユーザーを選択してください。</p>
        </div>
      )}

      <TrainerCardList trainerList={trainers} onSelect={handleTrainerClick} />

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
