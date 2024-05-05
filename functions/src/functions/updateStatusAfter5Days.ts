import * as functions from 'firebase-functions';
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
      await doc.ref.update({ status: 'rejected' });
    });
  });
