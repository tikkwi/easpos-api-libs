import { AUDIT } from '@common/constant';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { AuditService } from 'apps/admin/src/audit/audit.service';
import { Request } from 'express';
import { ClientSession } from 'mongoose';

export abstract class TransactionService {
  @Inject(AUDIT) private readonly auditService: AuditService;
  // @Inject(getServiceToken(AUDIT)) private readonly auditService: AuditService;

  async startTransaction(request: Request): Promise<ClientSession> {
    const connection = await this.mongooseService.getConnection(
      request.app === EApp.Admin || !request.merchant.dbUri
        ? undefined
        : request.merchant.dbUri,
    );
    const session = await connection.startSession();
    session.startTransaction();
    return session;
  }

  async endTransaction({ request, log, response, result }: EndTransactionType) {
    const session = request.$session;
    if (log)
      this.auditService.logRequest({
        request,
        log,
        user: request.user
          ? {
              user: request.user._id,
              email: request.user.mail,
              name: `${request.user.firstName} ${request.user.lastName}`,
              type: request.user.type,
            }
          : undefined,
      });
    session.commitTransaction();
    session.endSession();
    if (response) response.send(result?.data);
    else return result;
  }

  //NOTE: only for cross db transaction(admin>other apps)
  async makeTransaction(
    request: Request,
    action: () => MakeTransationActionReturn,
  ) {
    const session = await this.startTransaction(request);
    request.$crossSession = session;
    try {
      const [res, logTrail] = await action();
      request.logTrail.push({
        ...logTrail,
        method: request.method,
        response: res,
      });
      session.commitTransaction();
      session.endSession();
      request.$crossSession = undefined;
      return res;
    } catch (error) {
      session.abortTransaction();
      session.endSession();
      request.$crossSession = undefined;
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }
}
