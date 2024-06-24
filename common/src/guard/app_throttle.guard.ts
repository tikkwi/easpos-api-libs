import { APP_CONTEXT, C_USER, EXCEED_LIMIT } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AuthUser } from '@common/dto/core.dto';
import { isPeriodExceed } from '@common/utils/datetime';
import { getServiceToken } from '@common/utils/misc';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { ExceedLimitService } from '@shared/exceed_limit/exceed_limit.service';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Request } from 'express';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

@Injectable()
export class AppThrottleGuard extends ThrottlerGuard {
  @Inject(getServiceToken(EXCEED_LIMIT)) private readonly exceedLimitService: ExceedLimitService;
  @Inject(APP_CONTEXT) private readonly context: ContextService;

  async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const tracker = await this.getTracker(request);
    const key = this.generateKey(context, tracker, 'default');
    const { totalHits } = await this.storageService.increment(key, ttl);
    const isExceed = totalHits > limit;
    const user = this.context.get<AuthUser>(C_USER);
    const blockMsg = `${user ? `${user.firstName} ${user.lastName}` : request.ip}`;

    const { data: exceedLimit } = isExceed
      ? await this.exceedLimitService.limitRequest()
      : await this.exceedLimitService.getLimit({});

    if (exceedLimit) {
      if (exceedLimit.blocked && !exceedLimit.threshold.blockedUntil)
        throw new ThrottlerException(`${blockMsg} is blocked. Please contact support..`);
      const [isBlockActive, until] = exceedLimit
        ? isPeriodExceed(exceedLimit.threshold.blockedUntil, exceedLimit.createdAt)
        : undefined;

      if (isBlockActive)
        throw new ThrottlerException(
          `${blockMsg} is blocked until ${dayjs(until).format('dd MMM yyyy, hh:mm')}. Please requestuest after that unless you'll be blocked more severely.`,
        );
      else if (!isExceed) await this.exceedLimitService.unlimitRequest({ id: exceedLimit.id });
    }
    return true;
  }

  protected throwException(message: string): void {
    throw new ThrottlerException(message);
  }
}
