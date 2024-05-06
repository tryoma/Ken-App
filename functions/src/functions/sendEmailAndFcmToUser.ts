import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { contents } from './contents';
import { AdviceRequest, AnnounceType, Content } from '../type';
// import logger from '../logger';

// nodemailerの設定
const mailTransport = nodemailer.createTransport({
  service: 'gmail', // Gmailを使用する場合
  auth: {
    user: functions.config().gmail.email, // Gmailアドレス
    pass: functions.config().gmail.password, // Gmailパスワード
  },
});

interface Data {
  userId: string;
  announceType: AnnounceType;
  adviceRequest: AdviceRequest;
}

export const sendEmailAndFcmToUser = functions
  .region('asia-northeast1')
  .https.onCall(async (data: Data, context) => {
    const { userId, announceType, adviceRequest } = data;
    console.log('userId:', userId);
    if (!userId || !announceType || !adviceRequest)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with arguments.'
      );

    try {
      // ユーザー情報の取得
      const userRecord = await admin.auth().getUser(userId);
      const email = userRecord.email; // メール送信用にユーザーのメールアドレスを取得
      const user = await admin
        .firestore()
        .collection('Users')
        .doc(userId)
        .get();
      if (!user.exists) {
        throw new Error('User not found');
      }
      const userData = user.data();
      const fcmToken = userData?.fcmToken; // FCM送信用にユーザーのFCMトークンを取得
      const content = contents.find(
        content => content.announceType === announceType
      );
      const { subject, body } = await createSubjectAndBody(
        content,
        adviceRequest
      );
      // メール送信
      const mailOptions = {
        from: functions.config().gmail.email,
        to: email,
        subject,
        text: content?.emailBody,
      };
      await mailTransport.sendMail(mailOptions);
      // logger.info('メール送信成功:', email);
      console.log('メール送信成功:', email);

      if (fcmToken) {
        // FCM送信
        const message = {
          notification: {
            title: content?.fcmTitle,
            body,
            clickAction: content?.fcmClickAction,
          },
          token: fcmToken,
        };
        await admin.messaging().send(message);
        // logger.info('FCM送信成功:', userId);
        console.log('FCM送信成功:', userId);
      } else {
        // logger.info('FCMトークンが見つかりませんでした:', userId);
        console.error('FCMトークンが見つかりませんでした:');
      }

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

const createSubjectAndBody = async (
  content: Content | undefined,
  adviceRequest: AdviceRequest
) => {
  if (!content) return { subject: '', body: '' };
  let subject = content.emailSubject;
  let body = content.emailBody;
  console.log('adviceRequest:', adviceRequest);
  const requestPoint = adviceRequest.requestPoint || 0;
  const userName = await fetchUserName(adviceRequest.userId);
  const trainerName = await fetchUserName(adviceRequest.trainerUserId);
  subject = subject
    .replace('【依頼者の名前】', userName)
    .replace('【トレーナーの名前】', trainerName)
    .replace('【ポイント】', requestPoint.toString());
  body = body
    .replace('【依頼者の名前】', userName)
    .replace('【トレーナーの名前】', trainerName)
    .replace('【ポイント】', requestPoint.toString());
  return { subject, body };
};

const fetchUserName = async (userId: string | undefined) => {
  if (!userId) return '';
  const user = await admin.firestore().collection('Users').doc(userId).get();
  if (!user.exists) {
    throw new Error('User not found');
  }
  return user.data()?.name as string;
};
