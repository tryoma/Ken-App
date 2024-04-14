'use client';

import { useEffect, useState } from 'react';
import { PointHistory, historyType } from '@/type';
import { formatDateMMddHHmm } from '@/util/logic';
import { useAppContext } from '@/context/AppContext';
import { PointHistoryService } from '@/service/useCase/point-history.service';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import LoadMoreIcon from '@/app/components/icons/LoadMoreIcon';

const LIMIT_COUNT = 8;

const PointHistory = () => {
  const { userId } = useAppContext();
  const [pointHistoryList, setPointHistoryList] = useState<
    PointHistory[] | null
  >(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null
  );
  const [isVisibleMoreButton, setIsVisibleMoreButton] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    const { histories: pointHistories, next } =
      await PointHistoryService.fetchPointHistoryList(
        userId,
        LIMIT_COUNT,
        lastVisible
      );
    if (pointHistories.length > LIMIT_COUNT) {
      const newArray = pointHistories.slice(0, LIMIT_COUNT);
      setPointHistoryList(prev => {
        return prev ? [...prev, ...newArray] : newArray;
      });
      setIsVisibleMoreButton(true);
    } else {
      setPointHistoryList(prev => {
        return prev ? [...prev, ...pointHistories] : pointHistories;
      });
      setIsVisibleMoreButton(false);
    }
    setLastVisible(next);
  };

  const handleClickArrow = async () => {
    await fetchData();
  };

  const historyTypeFormatter = (type: historyType) => {
    switch (type) {
      case 'purchase':
        return '購入';
      case 'add':
        return '追加';
      case 'use':
        return '利用';
      case 'get':
        return '回答';
      default:
        return '不明';
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded p-6 shadow-md ">
        <h2 className="text-2xl font-semibold mb-6">ポイント履歴</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2">履歴ID</th>
              <th className="py-2">日付</th>
              <th className="py-2">ポイント</th>
              <th className="py-2">金額</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {pointHistoryList?.map((pointHistory, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2">{pointHistory.id.substring(0, 5)}</td>
                <td className="py-2">
                  {formatDateMMddHHmm(pointHistory.createdAt)}
                </td>
                <td className="py-2">{pointHistory.point}P</td>
                <td className="py-2">
                  {historyTypeFormatter(pointHistory.historyType)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isVisibleMoreButton && (
          <div className="mt-4 flex justify-center">
            <div onClick={handleClickArrow}>
              <LoadMoreIcon size={'2em'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointHistory;
