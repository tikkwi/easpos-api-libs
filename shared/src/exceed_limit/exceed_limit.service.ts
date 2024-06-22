import { AppService } from '@common/decorator/app_service.decorator';
import { ExceedLimit } from './exceed_limit.schema';
import { CoreService } from '@common/core/core.service';
import {
  ExceedLimitServiceMethods,
  GetLimitDto,
  UnlimitRequestDto,
} from '@shared/exceed_limit/exceed_limit.dto';
import { BaseDto } from '@common/dto/core.dto';

@AppService()
export class ExceedLimitService
  extends CoreService<ExceedLimit>
  implements ExceedLimitServiceMethods
{
  async getLimit({ request, ...dto }: GetLimitDto) {
    const { id, lean } = dto;
    return await this.repository.findOne({
      filter: {
        _id: id,
        $or: id ? undefined : [{ user: { user: request.user._id } }, { submittedIP: request.ip }],
      },
      options: { lean },
    });
  }

  async limitRequest({ request }: BaseDto) {
    const { data: limit } = await this.getLimit({ request });
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
        threshold: request.appConfig.throttleThresholds.find((e) => e.isInitial),
      });
  }

  async unlimitRequest({ id }: UnlimitRequestDto) {
    return await this.repository.findAndUpdate({
      id,
      update: { blocked: false, threshold: null },
    });
  }
}
