import { EXCEED_LIMIT } from '@app/constant';
import { Repository } from '@app/core';
import { AppService } from '@app/decorator/app_service.decorator';
import { BaseDto } from '@app/dto';
import { ExceedLimit, ExceedLimitSchema } from '@app/schema';
import { Inject, Injectable } from '@nestjs/common';
import { GetLimitDto, UnlimitRequestDto } from './exceed_limit.dto';
import { EApp } from '@app/helper';

@AppService(
  EApp.Admin,
  {
    getLimit: GetLimitDto,
    limitRequest: BaseDto,
    unlimitRequest: UnlimitRequestDto,
  },
  { name: ExceedLimit.name, schema: ExceedLimitSchema },
)
@Injectable()
export class ExceedLimitService {
  private repository: Repository<ExceedLimit>;

  async getLimit({ id, request, lean = true }: GetLimitDto) {
    return {
      data: await this.repository.findOne({
        filter: {
          _id: id,
          $or: id ? undefined : [{ user: { user: request.user._id } }, { submittedIP: request.ip }],
        },
        request,
        options: { lean },
      }),
    };
  }

  async limitRequest({ request }: BaseDto): Promise<any> {
    const { data: limit } = await this.getLimit({ request });
    if (limit)
      return {
        data: (
          await this.repository.findAndUpdate({
            id: limit._id,
            update: {
              threshold: limit.threshold.nextLimit,
            },
            request,
          })
        ).next,
      };
    else
      return {
        data: await this.repository.create({
          dto: {
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
          },
          request,
        }),
      };
  }

  async unlimitRequest({ request, id }: UnlimitRequestDto) {
    return {
      data: await this.repository.findAndUpdate({
        id,
        update: { blocked: false, threshold: null },
        request,
      }),
    };
  }
}
