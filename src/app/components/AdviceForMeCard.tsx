import { useEffect, useState } from 'react';
import { AdviceRequest, AdviceStatus, User } from '@/type';
import { UserService } from '@/service/useCase/user.service';

interface Props {
  adviceRequest: AdviceRequest;
  handleClick: (adviceRequest: AdviceRequest) => void;
  status: AdviceStatus;
}
const AdviceForMeCard = ({ adviceRequest, handleClick, status }: Props) => {
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
    <tr className="" key={adviceRequest.id}>
      <td className="border px-4 py-2">{user?.name} さんからの依頼</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => handleClick(adviceRequest)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          回答する
        </button>
      </td>
    </tr>
  );
};

export default AdviceForMeCard;
