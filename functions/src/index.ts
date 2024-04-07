import * as admin from 'firebase-admin';
admin.initializeApp();

export { generateVideoThumbnail } from './functions/generateVideoThumbnail';
export { updateStatusAfter5Days } from './functions/updateStatusAfter5Days';
export { sendEmailAndFcmToUser } from './functions/sendEmailAndFcmToUser';
