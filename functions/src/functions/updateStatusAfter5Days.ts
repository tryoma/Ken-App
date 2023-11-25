import * as functions from 'firebase-functions';

export const updateStatusAfter5Days = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 1 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async context => {
    console.log('This will be run every day at AM 1:00 Tokyo time!');
    // const now = admin.firestore.Timestamp.now();
    // const fiveDaysAgo = admin.firestore.Timestamp.fromMillis(
    //   now.toMillis() - 5 * 24 * 60 * 60 * 1000
    // );

    // const adviceRequestRef = admin.firestore().collection('AdviceRequest');
    // const snapshot = await adviceRequestRef
    //   .where('createdAt', '<=', fiveDaysAgo)
    //   .get();

    // const batch = admin.firestore().batch();

    // snapshot.docs.forEach(doc => {
    //   if (doc.data().status !== 'new_status') {
    //     // ここで必要なステータスに応じて変更してください
    //     batch.update(doc.ref, { status: 'new_status' }); // ここで新しいステータスに更新
    //   }
    // });

    // await batch.commit();
  });
