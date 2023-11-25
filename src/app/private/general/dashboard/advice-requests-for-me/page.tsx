'use client';
import { useEffect, useState } from 'react';
import { AdviceRequest } from '@/type';
import { useAppContext } from '@/context/AppContext';
import AdviceRequestCommentModal from '@/app/components/Modal/AdviceRequestCommentModal';
import UserCard from '@/app/components/UserCard';
import { AdviceRequestService } from '@/service/useCase/advice-request.service';

const AdviceRequestsForMe = () => {
  const { userId } = useAppContext();

  const [requestedAdviceRequestsForMe, setRequestedAdviceRequestsForMe] =
    useState<AdviceRequest[] | null>(null);

  const [selectedAdviceRequest, setSelectedAdviceRequest] =
    useState<AdviceRequest | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const { adviceRequests: requestedAdviceRequestsForMe } =
        await AdviceRequestService.fetchAdviceRequestListForMe(
          userId,
          'requested'
        );
      setRequestedAdviceRequestsForMe(requestedAdviceRequestsForMe);
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
      <h1 className="text-xl font-bold mb-4">自分への依頼一覧</h1>
      <div className="flex flex-col space-y-4">
        {/* 選択中の依頼 */}
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">依頼中</h2>
          {requestedAdviceRequestsForMe?.length === 0 && (
            <p>依頼はありません</p>
          )}
          {requestedAdviceRequestsForMe?.map(adviceRequest => (
            <UserCard
              key={adviceRequest.id}
              adviceRequest={adviceRequest}
              handleClick={handleRequestClick}
              status="requested"
              isTeacher={true}
            />
          ))}
        </div>
      </div>
      {selectedAdviceRequest && (
        <AdviceRequestCommentModal
          onClose={onModalClose}
          selectedAdviceRequest={selectedAdviceRequest}
        />
      )}
    </div>
  );
};

export default AdviceRequestsForMe;
