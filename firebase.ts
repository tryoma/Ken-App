import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const provider = new GoogleAuthProvider();
// const messaging = getMessaging(app);

// export const requestForToken = () => {
//   return getToken(messaging, {
//     vapidKey:
//       'BMohCck7syll1gEZmQV3P0ixfx2zYhVet6lbkzd15MkEyOQYOLndiW45dKXrMpILHRY9MPGBERv15-zZeTnY3Ns',
//   })
//     .then(currentToken => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         // Perform any other neccessary action with the token
//       } else {
//         // Show permission request UI
//         console.log(
//           'No registration token available. Request permission to generate one.'
//         );
//       }
//     })
//     .catch(err => {
//       console.log('An error occurred while retrieving token. ', err);
//     });
// };

// export const onMessageListener = () =>
//   new Promise(resolve => {
//     onMessage(messaging, payload => {
//       console.log('payload', payload);
//       resolve(payload);
//     });
//   });
