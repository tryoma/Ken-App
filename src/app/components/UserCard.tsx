import { useEffect, useState } from 'react';
import { AdviceRequest, AdviceStatus, User } from '@/type';
import { UserService } from '@/service/useCase/user.service';

interface Props {
  adviceRequest: AdviceRequest;
  handleClick: (adviceRequest: AdviceRequest) => void;
  status: AdviceStatus;
  isTeacher?: boolean;
}

const UserCard = ({
  adviceRequest,
  handleClick,
  status,
  isTeacher = false,
}: Props) => {
  const { trainerUserId, userId } = adviceRequest;
  const [trainer, setTrainer] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!trainerUserId || !userId) return;
      const trainer = await UserService.fetchUser(trainerUserId);
      const user = await UserService.fetchUser(userId);
      setTrainer(trainer);
      setUser(user);
    };
    fetchData();
  }, [trainerUserId, userId]);

  const getButtonLabel = (status: AdviceStatus) => {
    switch (status) {
      case 'prepared':
        return '申し込む';
      case 'requested':
        return '回答待ち';
      case 'accepted':
        return '回答確認';
      case 'rejected':
        return '詳細';
      default:
        return '';
    }
  };

  return (
    <tr className="" key={adviceRequest.id}>
      <td className="border px-4 py-2">
        {isTeacher
          ? `${trainer?.name}さん からの依頼`
          : `${user?.name}さん への依頼`}
      </td>
      <td className="border px-4 py-2 text-right">
        <button
          onClick={() => handleClick(adviceRequest)}
          className="bg-blue-500 text-white text-xs p-1.5 rounded"
        >
          {getButtonLabel(status)}
        </button>
      </td>
    </tr>
  );
};

export default UserCard;
