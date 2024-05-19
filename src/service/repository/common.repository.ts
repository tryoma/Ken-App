import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { ContentMap, ContentType } from '@/type';

export const CommonRepository = {
  fetchContentsSubscribe: (
    contentType: ContentType,
    onContents: (contents: ContentMap[ContentType][]) => void
  ) => {
    const contentsRef = collection(db, contentType);
    const unsubscribe = onSnapshot(contentsRef, snapshot => {
      const newContents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ContentMap[ContentType][];
      onContents(newContents);
    });
    return unsubscribe;
  },

  fetchContentById: async (contentType: ContentType, id: string) => {
    const contentsRef = doc(db, contentType, id);
    const docSnap = await getDoc(contentsRef);
    const contentData = docSnap.exists() ? docSnap.data() : null;
    const content = contentData
      ? ({ id, ...contentData } as ContentMap[ContentType])
      : null;
    return content;
  },

  updateContentById: async (
    contentType: ContentType,
    id: string,
    data: Partial<ContentMap[ContentType]>
  ) => {
    const docRef = doc(db, contentType, id);
    await setDoc(docRef, data, { merge: true });
  },

  createContent: async (
    contentType: ContentType,
    data: Partial<ContentMap[ContentType]>
  ) => {
    const contentsRef = collection(db, contentType);
    const newData = {
      ...data,
      createdAt: Timestamp.now(),
    }
    await addDoc(contentsRef, newData);
  },
};
