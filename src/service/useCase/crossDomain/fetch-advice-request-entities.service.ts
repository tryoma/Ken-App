import { AdviceRequest } from '@/type';
import { UserService } from '../user.service';
import { TrainingRecordService } from '../training-record.service';

export const FetchAdviceRequestEntitiesService = {
  fetch: async (requestAdvice: AdviceRequest) => {
    const user = await UserService.fetchUser(requestAdvice.userId);
    const trainerUser = requestAdvice.trainerUserId
      ? await UserService.fetchUser(requestAdvice.trainerUserId)
      : null;
    const trainingRecord = requestAdvice.trainingRecordId
      ? await TrainingRecordService.fetchTrainingRecord(
          requestAdvice.trainingRecordId
        )
      : null;

    return { user, trainerUser, trainingRecord };
  },
};
