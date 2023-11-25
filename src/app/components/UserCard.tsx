import { useEffect, useState } from 'react';
import { AdviceRequest, User } from '@/type';
import { UserService } from '@/service/useCase/user.service';

interface Props {
  adviceRequest: AdviceRequest;
  handleClick: (adviceRequest: AdviceRequest) => void;
  status: 'prepared' | 'requested';
  isTeacher: boolean;
}
const UserCard = ({ adviceRequest, handleClick, status, isTeacher }: Props) => {
  const { trainerUserId, userId } = adviceRequest;
  const [user, setUser] = useState<User | null>(null);
  const [trainer, setTrainer] = useState<User | null>(null);

  useEffect(() => {
    if (!trainerUserId || !userId) return;
    const fetchData = async () => {
      const user = await UserService.fetchUser(userId);
      setUser(user);
      const trainer = await UserService.fetchUser(trainerUserId);
      setTrainer(trainer);
    };
    fetchData();
  }, [trainerUserId, userId]);

  return (
    <>
      <div className="flex items-center">
        <p className="mr-2">
          {isTeacher ? `${user?.name} さんからの` : `${trainer?.name} さんへの`}
          依頼
        </p>
        {status === 'prepared' && (
          <button
            onClick={() => handleClick(adviceRequest)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            申込
          </button>
        )}
        {status === 'requested' &&
          (isTeacher ? (
            <button
              onClick={() => handleClick(adviceRequest)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              回答
            </button>
          ) : (
            <p className="bg-gray-500 text-white px-4 py-2 rounded">申込済</p>
          ))}
      </div>
    </>
  );
};

export default UserCard;
