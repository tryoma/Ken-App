'use client';
import { useAppContext } from '@/context/AppContext';
import { useToastContext } from '@/context/ToastContext';
import { UserService } from '@/service/useCase/user.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';

const Notification = () => {
  const { userId } = useAppContext();
  const showToast = useToastContext();
  useEffect(() => {
    if (!userId) return;

    if (typeof window !== 'undefined') {
      const messaging = getMessaging();

      // 非同期処理を実行するための内部async関数を定義
      const fetchToken = async () => {
        try {
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          if (currentToken) {
            await UserService.updateUser(userId, { fcmToken: currentToken });
          } else {
            console.log(
              'No registration token available. Request permission to generate one.'
            );
            // ユーザーに通知の許可を求めるUIを表示
          }
        } catch (err) {
          console.log('An error occurred while retrieving token. ', err);
        }
      };

      // 定義したasync関数を呼び出す
      fetchToken();

      // メッセージリスナーを設定
      onMessage(messaging, payload => {
        console.log('Message received. ', payload);
        // ここで通知の内容を設定
        setNotification({
          title: 'test',
          body: 'test',
        });
      });
    }
  }, [userId]); // 依存配列にuserIdを追加

  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    if (notification?.title) {
      setTimeout(() => {
        showToast(notification.title + notification.body, 'info');
      }, 1000);
    }
  }, [notification, showToast]);

  return <></>;
};

export default Notification;
