'use client';
import { useEffect, useState } from 'react';
import { AdviceRequest } from '@/type';
import { useAppContext } from '@/context/AppContext';
import AdviceRequestDetailModal from '@/app/components/Modal/AdviceRequestDetailModal';
import UserCard from '@/app/components/UserCard';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';

const AdviceRequests = () => {
  const { userId } = useAppContext();
  const [selectedAdviceRequest, setSelectedAdviceRequest] =
    useState<AdviceRequest | null>(null);
  const [preparedAdviceRequests, setPreparedAdviceRequests] = useState<
    AdviceRequest[] | null
  >(null);
  const [requestedAdviceRequests, setRequestedAdviceRequests] = useState<
    AdviceRequest[] | null
  >(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { adviceRequests: preparedAdviceRequests } =
        await AdviceRequestService.fetchAdviceRequestList(userId, 'prepared');
      setPreparedAdviceRequests(preparedAdviceRequests);

      const { adviceRequests: requestedAdviceRequests } =
        await AdviceRequestService.fetchAdviceRequestList(userId, 'requested');
      setRequestedAdviceRequests(requestedAdviceRequests);
    };
    fetchData();
  }, [userId, selectedAdviceRequest]);

  const handleRequestClick = (adviceRequest: AdviceRequest) => {
    setSelectedAdviceRequest(adviceRequest);
    document.body.style.overflow = 'hidden';
  };

  const onModalClose = () => {
    setSelectedAdviceRequest(null);
    document.body.style.overflow = '';
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">アドバイス依頼一覧</h1>
      <div className="flex flex-col space-y-4">
        {/* 選択中の依頼 */}
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold">依頼作成中</h2>
          {preparedAdviceRequests?.length === 0 ? (
            <p className="text-xs">依頼がありません</p>
          ) : (
            preparedAdviceRequests?.map(adviceRequest => (
              <UserCard
                key={adviceRequest.id}
                adviceRequest={adviceRequest}
                handleClick={handleRequestClick}
                status="prepared"
                isTeacher={false}
              />
            ))
          )}
        </div>

        {/* 選択済みの依頼 */}
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">依頼作成済</h2>
          {requestedAdviceRequests?.length === 0 ? (
            <p className="text-xs">依頼がありません</p>
          ) : (
            requestedAdviceRequests?.map(adviceRequest => (
              <UserCard
                key={adviceRequest.id}
                adviceRequest={adviceRequest}
                handleClick={handleRequestClick}
                status="requested"
                isTeacher={false}
              />
            ))
          )}
        </div>
      </div>
      {selectedAdviceRequest && (
        <AdviceRequestDetailModal
          onModalClose={onModalClose}
          selectedAdviceRequest={selectedAdviceRequest}
        />
      )}
    </div>
  );
};

export default AdviceRequests;
