'use client';

import Image from 'next/image';
import { User } from '@/type';
import { imageUrl } from '@/util/logic';
import AdminIcon from '../icons/AdminIcon';
import { useRouter } from 'next/navigation';

interface Props {
  user: User;
}

const UserIconAndName = ({ user }: Props) => {
  const router = useRouter();
  return (
    <div className="flex w-72">
      <Image
        src={imageUrl(user.imageUrl)}
        width={100}
        height={100}
        alt="プロフィール画像"
        className="rounded-full w-1/12"
      />
      <div className="ml-1 truncate w-6/12 m-auto">{user.name ?? '未設定'}</div>
      <div className="m-auto" onClick={() => router.push('/private/admin')}>
        {user.isAdmin && <AdminIcon />}
      </div>
      <span className="ml-2 text-xs m-auto w-5/12">
        (所持P: {user.point?.toLocaleString() || 0}P)
      </span>
    </div>
  );
};

export default UserIconAndName;
