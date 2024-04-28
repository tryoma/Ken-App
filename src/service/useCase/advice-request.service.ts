import { AdviceRequest, AdviceStatus } from '@/type';
import { AdviceRequestRepository } from '../repository';

export const AdviceRequestService = {
  createAdviceRequest: async (
    userId: string,
    trainerUserId: string,
    trainingRecordId: string
  ) => {
    return await AdviceRequestRepository.createAdviceRequest(
      userId,
      trainerUserId,
      trainingRecordId
    );
  },

  updateAdviceRequest: async (
    adviceRequestId: string,
    data: Partial<AdviceRequest>
  ) => {
    return await AdviceRequestRepository.updateAdviceRequest(
      adviceRequestId,
      data
    );
  },

  fetchAdviceRequest: async (adviceRequestId: string) => {
    return await AdviceRequestRepository.fetchAdviceRequest(adviceRequestId);
  },

  fetchLatestPendingAdviceRequest: async (userId: string) => {
    return await AdviceRequestRepository.fetchLatestPendingAdviceRequest(
      userId
    );
  },

  fetchAdviceRequestList: async (userId: string, status: AdviceStatus) => {
    return await AdviceRequestRepository.fetchAdviceRequestList(userId, status);
  },

  fetchAdviceRequestListSubscribe: (
    userId: string,
    status: AdviceStatus,
    onAdviceRequestUpdate: (adviceRequests: AdviceRequest[]) => void
  ) => {
    return AdviceRequestRepository.fetchAdviceRequestListSubscribe(
      userId,
      status,
      onAdviceRequestUpdate
    );
  },

  fetchAdviceRequestsCount: async (userId: string, status: AdviceStatus) => {
    return await AdviceRequestRepository.fetchAdviceRequestsCount(
      userId,
      status
    );
  },

  fetchAdviceRequestListForMe: async (
    trainerUserId: string,
    status: AdviceStatus
  ) => {
    return await AdviceRequestRepository.fetchAdviceRequestListForMe(
      trainerUserId,
      status
    );
  },

  fetchAdviceRequestsForMeCount: async (
    trainerUserId: string,
    status: AdviceStatus
  ) => {
    return await AdviceRequestRepository.fetchAdviceRequestsForMeCount(
      trainerUserId,
      status
    );
  },
};
