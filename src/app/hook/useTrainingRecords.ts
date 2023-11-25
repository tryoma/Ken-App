import { useEffect, useState } from 'react';
import { TrainingRecord } from '@/type';
import { DocumentSnapshot } from 'firebase/firestore';
import {
  fetchTrainingRecordListForFavoriteWithFavoriteService,
  fetchTrainingRecordListForMeWithFavoriteService,
  fetchTrainingRecordListForPublicWithFavoriteService,
} from '@/service/useCase/crossDomain';

interface Props {
  userId: string | null;
  content: 'my' | 'favorite' | 'public';
  pageLimit: number;
}

const useTrainingRecords = ({ userId, content, pageLimit }: Props) => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // サービス関数をマッピングするオブジェクト
  const serviceMapping = {
    my: fetchTrainingRecordListForMeWithFavoriteService,
    favorite: fetchTrainingRecordListForFavoriteWithFavoriteService,
    public: fetchTrainingRecordListForPublicWithFavoriteService,
  };

  // 共通のfetch関数
  const fetchRecords = async (isInitialFetch: boolean = true) => {
    if (!userId) return;
    setLoadingMore(true);

    const service = serviceMapping[content];
    if (!service) return;

    const response = await service.fetch(
      userId,
      pageLimit,
      isInitialFetch ? null : lastDoc
    );

    if (response) {
      const { trainingRecordList, lastDocument } = response;
      if (isInitialFetch) {
        setRecords(trainingRecordList);
      } else {
        setRecords(prevRecords => [...prevRecords, ...trainingRecordList]);
      }
      setLastDoc(lastDocument);
      setHasMore(trainingRecordList.length >= pageLimit);
    }

    setLoadingMore(false);
  };

  // 初期フェッチ
  useEffect(() => {
    fetchRecords();
  }, [userId, content]);

  return {
    records,
    loadingMore,
    fetchMoreTrainingRecords: () => fetchRecords(false),
    hasMore,
    fetchRecords,
  };
};

export default useTrainingRecords;
