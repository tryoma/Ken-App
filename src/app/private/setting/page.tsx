'use client';

import { useAppContext } from '@/context/AppContext';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { useState } from 'react';

const Setting = () => {
  const { userId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const functions = getFunctions();
  if (process.env.NODE_ENV === 'development') {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
  const sendMailAndFcmToUser = httpsCallable(
    functions,
    'sendEmailAndFcmToUser'
  );

  const handleSendMail = async () => {
    if (!userId) {
      setError('ユーザーIDが存在しません');
      return;
    }
    setLoading(true);
    await sendMailAndFcmToUser({ userId })
      .then(result => {
        console.log('メール送信成功:', result);
        setLoading(false);
      })
      .catch(error => {
        console.error('エラー:', error);
        setError('メール送信に失敗しました');
        setLoading(false);
      });
  };

  return (
    <div className="mt-10">
      <button onClick={handleSendMail} disabled={loading}>
        {loading ? '送信中...' : 'メールを送る'}
      </button>
      {error && <div>{error}</div>}
      <div>Setting</div>
    </div>
  );
};

export default Setting;
