import { UserService } from '@/service/useCase/user.service';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  userId: string;
}

const UserIconAndNameWithUserId = ({ userId }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await UserService.fetchUser(userId);
      setUser(user);
    };
    fetchData();
  }, [userId]);
  return (
    user && (
      <div className="flex w-full">
        <Image
          src={imageUrl(user.imageUrl)}
          alt="プロフィール画像"
          width={20}
          height={20}
          className="rounded-full w-2/12"
        />
        <div className="ml-1 truncate w-10/12 m-auto">
          {user.name ?? '未設定'}
        </div>
      </div>
    )
  );
};

export default UserIconAndNameWithUserId;
