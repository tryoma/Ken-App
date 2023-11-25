import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { User } from '@/type';

export const UserRepository = {
  createUser: async (userId: string, data: Partial<User>): Promise<void> => {
    const docRef = doc(db, 'Users', userId);
    await setDoc(docRef, data);
  },

  fetchTrainers: async (userId: string): Promise<{ trainers: User[] }> => {
    const usersRef = collection(db, 'Users');
    const trainerQuery = query(usersRef, where('isTrainer', '==', true));
    const querySnapshot = await getDocs(trainerQuery);
    const trainers = querySnapshot.docs
      .filter(doc => doc.id !== userId)
      .map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
    return { trainers };
  },

  fetchUser: async (userId: string): Promise<User | null> => {
    const docRef = doc(db, 'Users', userId);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.exists() ? docSnap.data() : null;
    const user = userData ? ({ id: userId, ...userData } as User) : null;
    return user;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<void> => {
    const docRef = doc(db, 'Users', userId);
    await setDoc(docRef, data, { merge: true });
  },
};
