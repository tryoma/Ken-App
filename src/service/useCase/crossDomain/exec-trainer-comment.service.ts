import { AdviceRequest } from '@/type';
import { CommentService } from '../comment.service';
import { UserService } from '../user.service';
import { PointHistoryService } from '../point-history.service';
import { AdviceRequestService } from '../advice-request.service';

export const ExecTrainerCommentService = {
  execute: async (adviceRequest: AdviceRequest, comment: string) => {
    if (!adviceRequest.trainerUserId) {
      throw new Error('トレーナーIDが存在しません');
    }

    await CommentService.createTrainerComment(adviceRequest, comment);

    const getPoint = adviceRequest.paymentPoint || 0;

    const trainerUser = await UserService.fetchUser(
      adviceRequest.trainerUserId
    );

    if (!trainerUser) {
      throw new Error('トレーナーが存在しません');
    }

    const newPoint = trainerUser.point
      ? trainerUser.point + getPoint
      : getPoint;

    await UserService.updateUser(trainerUser.id, {
      point: newPoint,
    });

    await PointHistoryService.createPointHistory({
      userId: trainerUser.id,
      point: getPoint,
      historyType: 'get',
      adviceRequestId: adviceRequest.id,
    });

    const newAdviceRequest: Partial<AdviceRequest> = {
      status: 'accepted',
      paymentStatus: 'finished',
    };

    await AdviceRequestService.updateAdviceRequest(
      adviceRequest.id,
      newAdviceRequest
    );
  },
};
