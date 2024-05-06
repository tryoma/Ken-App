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
    console.log({ adviceRequests });
    adviceRequests.forEach(async doc => {
      const adviceRequest = doc.data();
      const userId = adviceRequest.userId;
      const trainerUserId = adviceRequest.trainerUserId;
      const user = await fetchUser(userId);
      if (!user || !user.data || adviceRequest.paymentStatus != 'pending') {
        return;
      }
      const newPoint = user.data.point + adviceRequest.paymentPoint;
      await user.ref.update({ point: newPoint });
      console.log({ adviceRequest });
      await createReturnPointHistory(userId, adviceRequest.paymentPoint);
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
  const userDoc = await admin.firestore().collection('Users').doc(userId).get();
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  return { data: userDoc.data(), ref: userDoc.ref };
};

const createReturnPointHistory = async (userId: string, point: number) => {
  await admin.firestore().collection('PointHistories').add({
    userId,
    point,
    historyType: 'return',
    createdAt: admin.firestore.Timestamp.now(),
  });
};

const createNotification = async (userId: string) => {
  await admin.firestore().collection('Notifications').add({
    type: 'individual',
    userId,
    message: 'アドバイス依頼がキャンセルされました',
    createdAt: admin.firestore.Timestamp.now(),
  });
};
