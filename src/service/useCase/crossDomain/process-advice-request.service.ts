import { AdviceRequestService } from '../advice-request.service';
import { UserService } from '../user.service';

export const ProcessAdviceRequestService = {
  create: async (
    adviceRequestId: string,
    focusPoint: string
  ): Promise<{ isSuccess: boolean; shortage: number }> => {
    const adviceReuest = await AdviceRequestService.fetchAdviceRequest(
      adviceRequestId
    );
    if (!adviceReuest) {
      return { isSuccess: false, shortage: 0 };
    }

    const user = await UserService.fetchUser(adviceReuest.userId);
    const trainerUser = await UserService.fetchUser(adviceReuest.trainerUserId);

    if (!user?.point || !trainerUser?.isTrainer || !trainerUser?.requestPoint) {
      return { isSuccess: false, shortage: 0 };
    }

    const diff = user.point - trainerUser.requestPoint;

    if (!(diff >= 0)) {
      return {
        isSuccess: false,
        shortage: diff,
      };
    }

    await UserService.updateUser(user.id, { point: diff });
    await AdviceRequestService.updateAdviceRequest(adviceRequestId, {
      status: 'requested',
      requestPoint: trainerUser.requestPoint,
      focusPoint,
      paymentStatus: 'pending',
    });

    return { isSuccess: true, shortage: 0 };
  },
};
