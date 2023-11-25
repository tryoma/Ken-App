import React from 'react';
import { ExtendedTrainingRecord, TrainingRecord } from '@/type';
import TrainingRecordCard from './TrainingRecordCard';

interface TrainingRecordCardListProps {
  trainingRecordList: ExtendedTrainingRecord[];
  onSelect: (trainingRecord: TrainingRecord) => void;
}

const TrainingRecordCardList = ({
  trainingRecordList,
  onSelect,
}: TrainingRecordCardListProps) => {
  return (
    <>
      {trainingRecordList.length === 0 && (
        <p className="text-xs">稽古記録はありません。</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainingRecordList.map((record, index) => (
          <TrainingRecordCard
            key={index}
            trainingRecord={record}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
};

export default TrainingRecordCardList;
