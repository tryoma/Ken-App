import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { Thumbnail } from '@/type';

export const ThumbnailRepository = {
  fetchThumbnail: async (commonKey: string): Promise<Thumbnail | null> => {
    const thumbnailsRef = collection(db, 'Thumbnails');
    const q = query(thumbnailsRef, where('commonKey', '==', commonKey));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return doc.data() as Thumbnail;
    } else {
      return null;
    }
  },
};
