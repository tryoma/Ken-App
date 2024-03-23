import { TrainingRecordService } from '@/service/useCase/training-record.service';
import { useEffect, useState } from 'react';

interface Props {
  trainingRecordId: string | null | undefined;
}

const TrainingRecordTitle = ({ trainingRecordId }: Props) => {
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (!trainingRecordId) return;
    const fetchData = async () => {
      const trainingRecord = await TrainingRecordService.fetchTrainingRecord(
        trainingRecordId
      );
      setTitle(trainingRecord?.title ?? '未設定');
    };
    fetchData();
  }, [trainingRecordId]);
  return <>{title}</>;
};

export default TrainingRecordTitle;
