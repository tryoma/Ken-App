'use client';

import { useAppContext } from '@/context/AppContext';
import { getFunctions, httpsCallable } from 'firebase/functions';

const Setting = () => {
  const { userId } = useAppContext();
  const functions = getFunctions(); // Firebase Functionsのインスタンスを取得
  const sendMailToUser = httpsCallable(functions, 'sendEmailToUserHttp');

  const handleSendMail = async () => {
    console.log({ sendMailToUser });
    if (!userId) return;
    await sendMailToUser({ userId })
      .then(result => {
        console.log('メール送信成功:', result);
      })
      .catch(error => {
        console.error('エラー:', error);
      });
  };

  return (
    <>
      <button onClick={handleSendMail}>メールを送る</button>
      <div>Setting</div>
    </>
  );
};

export default Setting;
