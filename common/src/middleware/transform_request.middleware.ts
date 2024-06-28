import {
  ADM_MRO_PWD,
  ADM_MRO_USR,
  APP,
  C_APP,
  C_APP_CONFIG,
  C_BASIC_AUTH,
  C_IS_SUB_ACTIVE,
  C_MERCHANT,
  C_REQ,
  C_RES,
  C_USER,
} from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AdminAppSharedServiceMethods } from '@common/dto/admin_app.dto';
import { decrypt } from '@common/utils/encrypt';
import { base64 } from '@common/utils/misc';
import { parsePath } from '@common/utils/regex';
import { Metadata } from '@grpc/grpc-js';
import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class TransformRequestMiddleware implements NestMiddleware {
  constructor(
    private readonly adminAppService: AdminAppSharedServiceMethods,
    private readonly context: ContextService,
    private readonly config: ConfigService,
  ) {}

  async use(request: Request, response: Response, next: () => void) {
    const [app]: any = parsePath(request.originalUrl);
    let id;

    if (request.session.user) {
      ({ id } = await decrypt(request.session.user));
      if (!id) throw new ForbiddenException();
    }

    const metadata = new Metadata();

    if (this.config.get(APP) === 'admin')
      metadata.set(
        'Authorization',
        base64(`${this.config.get(ADM_MRO_USR)}:${this.config.get(ADM_MRO_PWD)}`),
      );

    const { config, isSubActive, merchant, user, basicAuth } =
      await this.adminAppService.getAuthData({ url: request.originalUrl, id });

    this.context.set({
      [C_APP]: app,
      [C_USER]: user,
      [C_MERCHANT]: merchant,
      [C_APP_CONFIG]: config,
      [C_IS_SUB_ACTIVE]: isSubActive,
      [C_BASIC_AUTH]: basicAuth,
      [C_REQ]: request,
      [C_RES]: response,
    });

    next();
  }
}
