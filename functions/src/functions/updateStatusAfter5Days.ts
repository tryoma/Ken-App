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
      console.log({ adviceRequest });
      await doc.ref.update({ status: 'rejected', paymentStatus: 'unpaid' });
      const userId = adviceRequest.userId;
      // const paymentPoint = doc.data().paymentPoint;
      await axios.post(
        'https://asia-northeast1-ken-app-5926d.cloudfunctions.net/sendEmailAndFcmToUser',
        { data: { userId, announceType: 'adviceRequestCanceledToUser' } }
      );
      const trainerUserId = adviceRequest.trainerUserId;
      await axios.post(
        'https://asia-northeast1-ken-app-5926d.cloudfunctions.net/sendEmailAndFcmToUser',
        {
          data: {
            userId: trainerUserId,
            announceType: 'adviceRequestCanceledToUser',
          },
        }
      );
    });
  });
