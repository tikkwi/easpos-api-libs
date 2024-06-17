import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator/app_service.decorator';
import {
  ExceedLimitServiceMethods,
  GetLimitDto,
  UnlimitRequestDto,
} from '@shared/dto';
import { Request } from 'express';
import { ExceedLimit, ExceedLimitSchema } from './exceed_limit.schema';

@AppService()
export class ExceedLimitService
  extends CoreService<ExceedLimit>
  implements ExceedLimitServiceMethods
{
  constructor() {
    super(ExceedLimit.name, ExceedLimitSchema);
  }

  async getLimit(request: Request, dto?: GetLimitDto) {
    const { id, lean } = dto;
    return await this.repository.findOne({
      filter: {
        _id: id,
        $or: id
          ? undefined
          : [{ user: { user: request.user._id } }, { submittedIP: request.ip }],
      },
      options: { lean },
    });
  }

  async limitRequest(request: Request) {
    const { data: limit } = await this.getLimit(request);
    if (limit)
      return {
        data: (
          await this.repository.findAndUpdate({
            id: limit._id,
            update: {
              threshold: limit.threshold.nextLimit,
            },
          })
        ).data,
      };
    else
      return await this.repository.create({
        user: request.user
          ? {
              user: request.user._id,
              type: request.user.type,
              name: `${request.user.firstName} ${request.user.lastName}`,
            }
          : undefined,
        submittedIP: request.ip,
        sessionId: request.sessionID,
        userAgent: request.headers['user-agent'] as any,
        threshold: request.appConfig.throttleThresholds.find(
          (e) => e.isInitial,
        ),
      });
  }

  async unlimitRequest({ id }: UnlimitRequestDto) {
    return await this.repository.findAndUpdate({
      id,
      update: { blocked: false, threshold: null },
    });
  }
}
