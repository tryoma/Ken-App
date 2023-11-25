import { User } from '@/type';
import { UserRepository } from '../repository';


export const UserService = {
  createUser: async (userId: string, data: Partial<User>) => {
    return UserRepository.createUser(userId, data);
  },

  fetchTrainers: async (userId: string) => {
    return UserRepository.fetchTrainers(userId);
  },

  fetchUser: async (userId: string) => {
    return UserRepository.fetchUser(userId);
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    return UserRepository.updateUser(userId, data);
  },
};
