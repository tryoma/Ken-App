'use client';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { auth } from '../../../../firebase';
import { useRouter } from 'next/navigation';

type Inputs = {
  email: string;
};

const ResetPass = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const actionCodeSettings = {
    // パスワード再設定後のリダイレクト URL
    url: 'http://localhost:3000/auth/login',
    handleCodeInApp: false,
  }

  const onSubmit: SubmitHandler<Inputs> = async data => {
    await sendPasswordResetEmail(auth, data.email, actionCodeSettings)
      .then(() => {
        // パスワードリセットメール送信成功
        alert('入力頂いたメール宛に、パスワードリセットメールを送信しました。');
      })
      .catch(error => {
        // パスワードリセットメール送信エラー
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          alert('このメールアドレスは登録されていません。');
        } else {
          alert('メールアドレスが間違っています。');
        }
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">パスワード変更</h1>
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            送信
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            既にアカウントをお持ちですか？
          </span>
          <Link
            href={'/auth/login'}
            className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
          >
            ログインページへ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPass;
