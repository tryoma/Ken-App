'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, storage } from '../../../../firebase';
import { useAppContext } from '@/context/AppContext';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Experience, Rank, User } from '@/type';
import { imageUrl } from '@/util/logic';
import {
  CommonSnackbarWithRef,
  SnackbarHandler,
} from '@/app/components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserSchema } from '@/validationSchema';
import { UserService } from '@/service/useCase/user.service';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const Profile = () => {
  const { userId, settingChangeFlag, setSettingChangeFlag, user } =
    useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const snackbarRef = useRef<SnackbarHandler>(null);
  const openSnackbar = (message: string) => {
    if (snackbarRef.current) {
      snackbarRef.current.open(message);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<User>({
    mode: 'all',
    resolver: yupResolver(UserSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const user = await UserService.fetchUser(userId);
      if (user) reset(user);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const handleUpdate = async (data: User) => {
    if (!userId) return;
    await UserService.updateUser(userId, data);
    setSettingChangeFlag(!settingChangeFlag);
    openSnackbar('プロフィールを更新しました');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    if (file.size > 1024000) {
      alert('ファイルサイズは1MB以下にしてください');
      return;
    }

    if (!file.type.includes('image')) {
      alert('画像ファイルを選択してください');
      return;
    }
    const fileRef = ref(storage, 'images/' + file.name);

    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    setValue('imageUrl', fileURL);
  };

  const handleChangeEmail = async () => {
    if (!user) return;
    const ok = confirm('メールアドレスを変更しますか？');
    if (!ok) return;
    const newEmail = prompt('新しいメールアドレスを入力してください');
    if (!newEmail) return;
    try {
      await verifyBeforeUpdateEmail(user, newEmail);
      alert('確認メールを送信しました');
      auth.signOut();
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/requires-recent-login') {
        // ユーザーに再ログインを促す
        alert(
          'セキュリティ上の理由から、操作を続行するには再ログインが必要です。そのため、一度ログアウトします。再度、ログイン後、再度メールアドレスの変更処理を行ってください。'
        );
        auth.signOut();
      } else {
        // その他のエラー処理
        console.error('メールアドレスの変更中にエラーが発生しました:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="container mx-auto p-4 max-w-screen-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">プロフィール</h1>

        <div className="flex justify-center mb-6">
          <Image
            src={imageUrl(watch('imageUrl'))}
            alt="プロフィール画像"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <div className="flex justify-center mb-6">
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            name="imageUrl"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center justify-center mb-6">
          <p className="text-sm mr-2">
            所有ポイント：{(getValues('point') ?? 0).toLocaleString()}P
          </p>
          <Link
            href="/private/point"
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
          >
            ポイント購入ページへ
          </Link>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              メールアドレス
            </label>
            <p className="w-full pb-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              {user?.email}{' '}
              <button
                className="ml-1 text-sm bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleChangeEmail}
              >
                変更
              </button>
            </p>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              名前
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="名前"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-500 text-xs italic">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="isTrainer"
            >
              トレーナー設定
            </label>
            <input
              className="mr-2 leading-tight"
              type="checkbox"
              defaultChecked={getValues('isTrainer')}
              {...register('isTrainer')}
            />
            <label htmlFor="isTrainer" className="text-sm">
              トレーナーになる
            </label>
          </div>
          {watch('isTrainer') && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="requestPoint"
              >
                アドバイス依頼に必要なポイント
              </label>
              <div className="relative mb-2">
                <input
                  className="appearance-none h-4 bg-gray-300 rounded-md w-full"
                  type="range"
                  defaultValue={getValues('requestPoint')}
                  {...register('requestPoint')}
                  min="100"
                  max="3000"
                  step="100"
                />
                <div className="flex justify-between w-full mt-1">
                  <span className="text-sm">100P</span>
                  <span className="text-sm text-red-400">
                    {watch('requestPoint') ?? '-'} P
                  </span>
                  <span className="text-sm">3000P</span>
                </div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="kendoRank"
            >
              剣道段位
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('kendoRank')}
            >
              {Object.values(Rank).map(rankValue => (
                <option key={rankValue} value={rankValue}>
                  {rankValue}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              剣道歴
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('kendoExperience')}
            >
              {Object.values(Experience).map(experienceValue => (
                <option key={experienceValue} value={experienceValue}>
                  {experienceValue}
                </option>
              ))}
            </select>
            {errors.kendoExperience && (
              <span className="text-red-500 text-xs italic">
                {errors.kendoExperience.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="kendoGoal"
            >
              剣道の目標
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="今年中に七段取得！"
              {...register('kendoGoal')}
            ></textarea>
            {errors.kendoGoal && (
              <span className="text-red-500 text-xs italic">
                {errors.kendoGoal.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="biography"
            >
              略歴
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="略歴"
              {...register('biography')}
            ></textarea>
            {errors.biography && (
              <span className="text-red-500 text-xs italic">
                {errors.biography.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              自己紹介
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="会社員です"
              {...register('bio')}
            ></textarea>
            {errors.bio && (
              <span className="text-red-500 text-xs italic">
                {errors.bio.message}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit(handleUpdate)}
              type="button"
            >
              更新
            </button>
          </div>
        </div>
      </div>
      <CommonSnackbarWithRef ref={snackbarRef} />
    </>
  );
};

export default Profile;
