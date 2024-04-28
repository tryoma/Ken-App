import { AdviceRequestService } from '@/service/useCase/advice-request.service';
import { AdviceRequest, AdviceStatus } from '@/type';
import { useEffect, useState } from 'react';
import UserCard from '../UserCard';

type AdviceAreaProps = {
  userId: string | null;
  contentStatus: AdviceStatus;
  clickRequest: (adviceRequest: AdviceRequest) => void;
};

const AdviceArea = ({
  userId,
  contentStatus,
  clickRequest,
}: AdviceAreaProps) => {
  const [adviceRequests, setAdviceRequests] = useState<AdviceRequest[] | null>(
    null
  );

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = AdviceRequestService.fetchAdviceRequestListSubscribe(
      userId,
      contentStatus,
      adviceRequests => {
        setAdviceRequests(adviceRequests);
      }
    );
    return () => unsubscribe();
  }, [userId, contentStatus]);

  return (
    <div className="bg-gray-200 p-1 mt-3 rounded-md">
      <table className="table-fixed w-full">
        {adviceRequests?.length === 0 ? (
          <tbody className="">
            <td className="border px-4 py-2">依頼がありません</td>
          </tbody>
        ) : (
          <tbody>
            {adviceRequests?.map(adviceRequest => (
              <UserCard
                key={adviceRequest.id}
                adviceRequest={adviceRequest}
                handleClick={clickRequest}
                status={contentStatus}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default AdviceArea;
