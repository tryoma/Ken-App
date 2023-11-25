import { AdviceRequestService } from '../advice-request.service';
import { TrainingRecordService } from '../training-record.service';
import { UserService } from '../user.service';

export const FetchLatestAdviceRequestEntitiesService = {
  fetch: async (userId: string) => {
    const latestAdviceRequest =
      await AdviceRequestService.fetchLatestPendingAdviceRequest(userId);
    if (!latestAdviceRequest) {
      return { user: null, trainingRecord: null, adviceRequest: null };
    }

    const user = latestAdviceRequest.trainerUserId
      ? await UserService.fetchUser(latestAdviceRequest.trainerUserId)
      : null;
    const trainingRecord = latestAdviceRequest.trainingRecordId
      ? await TrainingRecordService.fetchTrainingRecord(
          latestAdviceRequest.trainingRecordId
        )
      : null;

    return { user, trainingRecord, adviceRequest: latestAdviceRequest };
  },
};
