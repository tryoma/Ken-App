import * as functions from 'firebase-functions';
import axios from 'axios';
import admin from 'firebase-admin';

export const updateStatusAfter5Days = functions
  .region('asia-northeast1')
  .pubsub.schedule('*/2 * * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async context => {
    const nowTime = admin.firestore.Timestamp.now();
    console.log({ nowTime });
    const adviceRequests = await admin
      .firestore()
      .collection('AdviceRequests')
      .where('status', '==', 'requested')
      .where('limitTime', '<=', nowTime)
      .get();
    adviceRequests.forEach(async doc => {
      const adviceRequest = doc.data();
      const userId = adviceRequest.userId;
      const trainerUserId = adviceRequest.trainerUserId;
      const user = await fetchUser(userId);
      if (!user) {
        return;
      }
      await user.ref.update({
        point: admin.firestore.FieldValue.increment(adviceRequest.paymentPoint),
      });
      await createReturnPointHistory(
        userId,
        adviceRequest.paymentPoint,
        adviceRequest.id
      );
      await createNotification(userId);
      await createNotification(trainerUserId);
      await doc.ref.update({ status: 'rejected', paymentStatus: 'unpaid' });
      // const paymentPoint = doc.data().paymentPoint;
      await axios
        .post(
          'https://asia-northeast1-ken-app-5926d.cloudfunctions.net/sendEmailAndFcmToUser',
          {
            data: {
              userId,
              announceType: 'adviceRequestCanceledToUser',
              adviceRequest,
            },
          }
        )
        .catch(error => {
          console.error({ error1: error });
        });
      await axios
        .post(
          'https://asia-northeast1-ken-app-5926d.cloudfunctions.net/sendEmailAndFcmToUser',
          {
            data: {
              userId: trainerUserId,
              announceType: 'adviceRequestCanceledToTrainer',
              adviceRequest,
            },
          }
        )
        .catch(error => {
          console.error({ error2: error });
        });
    });
  });

const fetchUser = async (userId: string) => {
  const user = await admin.firestore().collection('Users').doc(userId).get();
  if (!user.exists) {
    throw new Error('User not found');
  }
  return user.data();
};

const createReturnPointHistory = async (
  userId: string,
  point: number,
  adviceRequestId: string
) => {
  await admin.firestore().collection('PointHistories').add({
    userId,
    point,
    adviceRequestId,
    historyType: 'return',
  });
};

const createNotification = async (userId: string) => {
  await admin.firestore().collection('Notifications').add({
    type: 'individual',
    userId,
    message: 'アドバイス依頼がキャンセルされました',
  });
};
