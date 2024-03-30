'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '../../../../firebase';
import { GoogleButton } from '@/app/components/button/GoogleButton';
import { User } from '@/type';
import { UserService } from '@/service/useCase/user.service';

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onGoogleLogin = async () => {
    auth.signOut();
    await signInWithPopup(auth, provider)
      .then(async result => {
        const details = getAdditionalUserInfo(result);
        const isNewUser = details?.isNewUser;
        if (!isNewUser) {
          router.push('/private/general/dashboard');
          return;
        }
        const user = result.user;
        const userProfile: Omit<User, 'id'> = {
          name: user.displayName ?? '未設定',
          imageUrl: user.photoURL ?? '',
          isTrainer: false,
          point: 0,
          requestPoint: 100,
        };
        await UserService.createUser(user.uid, userProfile);
        router.push('/private/general/dashboard');
      })
      .catch(error => {
        alert('ログインに失敗しました。');
      });
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    auth.signOut();
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(_ => {
        router.push('/private/general/dashboard');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          alert('そのようなユーザーは存在しません。');
        } else {
          alert('メールアドレスまたはパスワードが間違っています。');
        }
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">ログイン</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register('email', {
              required: 'メールアドレスは必須です。',
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: '不適切なメールアドレスです。',
              },
            })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'パスワードは必須です。',
              minLength: {
                value: 6,
                message: '6文字以上入力してください。',
              },
            })}
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
          <div className="">
            <span className="text-gray-600 text-sm">
              パスワードを忘れた方は
            </span>
            <Link
              href={'/auth/reset-pass'}
              className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
            >
              こちら
            </Link>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            初めてのご利用の方はこちら
          </span>
          <Link
            href={'/auth/register'}
            className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
          >
            新規登録ページへ
          </Link>
        </div>
        <div className="mt-4">
          <GoogleButton onGoogleLogin={onGoogleLogin} />
        </div>
      </form>
    </div>
  );
};

export default Login;
