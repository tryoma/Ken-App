'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AdviceRequest,
  TrainingRecord,
  TrainingRecordFormValues,
} from '@/type';
import { useAppContext } from '@/context/AppContext';
import NewTrainingRecordModal from '@/app/components/Modal/NewTrainingRecordModal';
import TrainingRecordDetailModal from '@/app/components/Modal/TrainingRecordDetailModal';
import { FetchLatestAdviceRequestEntitiesService } from '@/service/useCase/crossDomain/fetch-latest-advice-request-entities.service';
import { TrainingRecordService } from '@/service/useCase/training-record.service';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';
import EditTrainingRecordModal from '@/app/components/Modal/EditTrainingRecordModal';
import TrainingRecordCardList from '@/app/components/trainingRecord/TrainingRecordCardList';
import useTrainingRecords from '@/app/hook/useTrainingRecords';
import UserIconAndNameWithUserId from '@/app/components/Modal/parts/UserIconAndNameWithUserId';

const MyTrainingRecords = () => {
  const router = useRouter();
  const { userId } = useAppContext();
  const [preparingAdviceRequest, setPreparingAdviceRequest] =
    useState<AdviceRequest | null>(null);
  const [selectedTrainingRecord, setSelectedTrainingRecord] =
    useState<TrainingRecord | null>(null);
  const [selectedEditTrainingRecord, setSelectedEditTrainingRecord] =
    useState<TrainingRecord | null>(null);
  const [isNewTrainingRecordModalOpen, setIsNewTrainingRecordModalOpen] =
    useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { adviceRequest, user: trainer } =
        await FetchLatestAdviceRequestEntitiesService.fetch(userId);
      if (adviceRequest && trainer) {
        setPreparingAdviceRequest(adviceRequest);
      }
    };
    fetchData();
  }, [userId]);

  const {
    records,
    loadingMore,
    fetchMoreTrainingRecords,
    hasMore,
    fetchRecords,
  } = useTrainingRecords({ userId, content: 'my', pageLimit: 12 });

  const onNewTrainingRecordSubmit = async (data: TrainingRecordFormValues) => {
    if (!userId) return;
    await TrainingRecordService.createTrainingRecord(userId, data);
    await fetchRecords();
    onNewRecordModalClose();
  };

  const onEditTrainingRecordSubmit = async (data: TrainingRecordFormValues) => {
    if (!userId || !selectedEditTrainingRecord) return;
    await TrainingRecordService.updateTrainingRecord(
      selectedEditTrainingRecord.id,
      data
    );
    await fetchRecords();
    onModalClose();
  };

  const onDeleteTrainingRequest = async (trainingRecord: TrainingRecord) => {
    if (!userId) return;
    await TrainingRecordService.deleteTrainingRecord(trainingRecord.id);
    await fetchRecords();
    onModalClose();
  };

  const onTrainingRecordRequest = async (trainingRecord: TrainingRecord) => {
    if (!userId) return;
    if (preparingAdviceRequest) {
      await AdviceRequestService.updateAdviceRequest(
        preparingAdviceRequest.id,
        {
          status: 'prepared',
          trainingRecordId: trainingRecord.id,
        }
      );
      router.push('/private/general/dashboard/advice-requests');
    } else {
      await AdviceRequestService.createAdviceRequest(
        userId,
        '',
        trainingRecord.id
      );
      router.push('/private/general/dashboard/trainers');
    }
  };

  const onRecordSelect = (record: TrainingRecord) => {
    setSelectedTrainingRecord(record);
    document.body.style.overflow = 'hidden';
  };

  const onNewRecordModalOpen = () => {
    setIsNewTrainingRecordModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const onNewRecordModalClose = () => {
    setIsNewTrainingRecordModalOpen(false);
    document.body.style.overflow = '';
  };

  const onModalClose = () => {
    setSelectedTrainingRecord(null);
    setSelectedEditTrainingRecord(null);
    document.body.style.overflow = '';
  };

  const onEditTrainingRequest = (trainingRecord: TrainingRecord) => {
    setSelectedTrainingRecord(null);
    setSelectedEditTrainingRecord(trainingRecord);
    document.body.style.overflow = 'hidden';
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
      <h1 className="text-xl font-bold mb-4">私の稽古記録</h1>
      <button
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onNewRecordModalOpen}
      >
        新しい記録を作成
      </button>

      {preparingAdviceRequest && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="flex items-center font-bold">
            アドバイス依頼(トレーナー選択中)
            <button
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={onDeleteAdviceRequest}
            >
              取消
            </button>
          </p>
          <div className="flex">
            <p className="mr-2">トレーナー:</p>
            <span className="font-semibold transition duration-100 md:text-lg">
              <UserIconAndNameWithUserId
                userId={preparingAdviceRequest.trainerUserId}
              />
            </span>
          </div>
          <p>依頼する動画を選択してください。</p>
        </div>
      )}

      <div className="p-4 border border-gray-200 rounded">
        <div className="space-y-4">
          <TrainingRecordCardList
            trainingRecordList={records}
            onSelect={onRecordSelect}
          />
          {hasMore && (
            <button
              className="p-2 bg-blue-500 text-white rounded m-auto block"
              onClick={fetchMoreTrainingRecords}
            >
              {loadingMore ? '読み込み中...' : 'もっと見る'}
            </button>
          )}
        </div>
      </div>
      {selectedTrainingRecord && (
        <TrainingRecordDetailModal
          trainingRecord={selectedTrainingRecord}
          onModalClose={onModalClose}
          onRequest={onTrainingRecordRequest}
          onEditRequest={onEditTrainingRequest}
          onDeleteRequest={onDeleteTrainingRequest}
          isExistRequest={true}
          isCanEdit={true}
          isCanDelete={true}
        />
      )}

      {selectedEditTrainingRecord && (
        <EditTrainingRecordModal
          trainingRecord={selectedEditTrainingRecord}
          onEditRecordClose={onModalClose}
          onSubmit={onEditTrainingRecordSubmit}
        />
      )}

      {isNewTrainingRecordModalOpen && (
        <NewTrainingRecordModal
          onNewRecordModalClose={onNewRecordModalClose}
          onSubmit={onNewTrainingRecordSubmit}
          userId={userId!}
        />
      )}
    </div>
  );
};

export default MyTrainingRecords;
