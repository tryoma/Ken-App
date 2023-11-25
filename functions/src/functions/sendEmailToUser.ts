import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// nodemailerの設定
const mailTransport = nodemailer.createTransport({
  service: 'gmail', // Gmailを使用する場合
  auth: {
    user: functions.config().gmail.email, // Gmailアドレス
    pass: functions.config().gmail.password, // Gmailパスワード
  },
});

export const sendEmailToUser = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const userId = data.userId;
    if (!userId)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with one argument "userId".'
      );

    try {
      // ユーザー情報の取得
      const userRecord = await admin.auth().getUser(userId);
      const email = userRecord.email; // メール送信用にユーザーのメールアドレスを取得

      // メール送信
      const mailOptions = {
        from: '"Your App Name" <your-app-email@gmail.com>',
        to: email,
        subject: 'メールの件名',
        text: 'メールの本文',
      };
      await mailTransport.sendMail(mailOptions);
      console.log('メール送信成功:', email);

      // FCM送信
      const message = {
        notification: {
          title: '通知のタイトル',
          body: '通知の本文',
        },
        token: userRecord.customClaims?.['fcmToken'], // FCMトークンはユーザーのカスタムクレームなどに保存されていると仮定
      };
      await admin.messaging().send(message);
      console.log('FCM送信成功:', userId);

      return { success: true };
    } catch (error) {
      console.error('エラー:', error);
      throw new functions.https.HttpsError(
        'unknown',
        'Failed to send mail and FCM.',
        error
      );
    }
  });
