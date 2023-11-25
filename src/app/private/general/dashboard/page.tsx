'use client';

import { useState } from 'react';
import { TrainingRecord } from '@/type';
import TrainingRecordDetailModal from '@/app/components/Modal/TrainingRecordDetailModal';
import { useAppContext } from '@/context/AppContext';
import TrainingRecordArea from '@/app/components/trainingRecord/TrainingRecordArea';

const Dashboard = () => {
  const { userId } = useAppContext();
  const [selectedTrainingRecord, setSelectedTrainingRecord] =
    useState<TrainingRecord | null>(null);

  const onRecordSelect = (record: TrainingRecord) => {
    setSelectedTrainingRecord(record);
    document.body.style.overflow = 'hidden';
  };

  const onModalClose = () => {
    setSelectedTrainingRecord(null);
    document.body.style.overflow = '';
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">ダッシュボード</h1>

      <div className="space-y-4">
        <TrainingRecordArea content={'my'} onRecordSelect={onRecordSelect} />
        <TrainingRecordArea
          content={'favorite'}
          onRecordSelect={onRecordSelect}
        />
        <TrainingRecordArea
          content={'public'}
          onRecordSelect={onRecordSelect}
        />
      </div>
      {selectedTrainingRecord && userId && (
        <TrainingRecordDetailModal
          trainingRecord={selectedTrainingRecord}
          onModalClose={onModalClose}
          onRequest={() => {}}
          isExistRequest={false}
        />
      )}
    </div>
  );
};

export default Dashboard;
