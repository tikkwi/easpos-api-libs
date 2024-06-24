import { C_APP_CONFIG, C_REQ, C_USER, REPOSITORY } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { Repository } from '@common/core/repository';
import { Inject, Injectable } from '@nestjs/common';
import {
  ExceedLimitServiceMethods,
  GetLimitDto,
  UnlimitRequestDto,
} from '@shared/exceed_limit/exceed_limit.dto';
import { Request } from 'express';
import { ExceedLimit } from './exceed_limit.schema';
import { AuthUser } from '@common/dto/core.dto';

@Injectable()
export class ExceedLimitService implements ExceedLimitServiceMethods {
  constructor(
    @Inject(REPOSITORY) private readonly repository: Repository<ExceedLimit>,
    private readonly context: ContextService,
  ) {}

  async getLimit({ id }: GetLimitDto) {
    const user = this.context.get<AuthUser>(C_USER);
    const ip = this.context.get<Request>(C_REQ).ip;
    return await this.repository.findOne({
      filter: {
        _id: id,
        $or: id ? undefined : [{ user: user?._id }, { submittedIP: ip }],
      },
    });
  }

  async limitRequest() {
    const user = this.context.get<AuthUser>(C_USER);
    const request = this.context.get<Request>(C_REQ);
    const appConfig = this.context.get<AppConfig>(C_APP_CONFIG);
    const { data: limit } = await this.getLimit({});
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
        user: user
          ? {
              user: user._id,
              type: user.type,
              name: `${user.firstName} ${user.lastName}`,
            }
          : undefined,
        submittedIP: request.ip,
        sessionId: request.sessionID,
        userAgent: request.headers['user-agent'] as any,
        threshold: appConfig.throttleThresholds.find((e) => e.isInitial),
      });
  }

  async unlimitRequest({ id }: UnlimitRequestDto) {
    return await this.repository.findAndUpdate({
      id,
      update: { blocked: false, threshold: null },
    });
  }
}
