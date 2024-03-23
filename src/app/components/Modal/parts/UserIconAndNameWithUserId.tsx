import { UserService } from '@/service/useCase/user.service';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  userId: string | null | undefined;
}

const UserIconAndNameWithUserId = ({ userId }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!userId) return;
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
          width={100}
          height={100}
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
