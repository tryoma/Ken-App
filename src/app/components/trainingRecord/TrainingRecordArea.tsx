import { TrainingRecord } from '@/type';
import TrainingRecordCardList from './TrainingRecordCardList';
import { useAppContext } from '@/context/AppContext';
import { use, useEffect, useState } from 'react';
import useTrainingRecords from '@/app/hook/useTrainingRecords';

interface TrainingRecordAreaProps {
  content: 'my' | 'favorite' | 'public';
  onRecordSelect: (trainingRecord: TrainingRecord) => void;
  pageLimit?: number;
}

const TrainingRecordArea = ({
  content,
  onRecordSelect,
  pageLimit = 6,
}: TrainingRecordAreaProps) => {
  const { userId } = useAppContext();
  const { records, loadingMore, fetchMoreTrainingRecords, hasMore } =
    useTrainingRecords({ userId, content, pageLimit });

  const title = (content: 'my' | 'favorite' | 'public') => {
    switch (content) {
      case 'my':
        return '最新の稽古記録';
      case 'favorite':
        return 'お気に入りの稽古記録';
      case 'public':
        return '他のユーザーの稽古記録';
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded">
      <h3 className="font-bold text-lg">{title(content)}</h3>
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
  );
};

export default TrainingRecordArea;
