import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { EApp } from '@common/utils/enum';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import {
   ForbiddenException,
   Inject,
   Injectable,
   InternalServerErrorException,
   NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { APP, AUTH_CREDENTIAL } from '@common/constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
   constructor(
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
      private readonly appBroker: AppBrokerService,
      private readonly config: ConfigService,
   ) {}

   async use(request: Request, response: Response, next: () => void) {
      const { userName, password } = await this.appBroker.request<BasicAuth>({
         action: (meta) => this.credService.getAuthCredential({ url: request.originalUrl }, meta),
         cache: true,
         key: AUTH_CREDENTIAL,
         app: EApp.Admin,
      });

      if (!userName) throw new InternalServerErrorException('No Auth Cred');

      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic'))
         response
            .status(401)
            .setHeader('WWW-Authenticate', `Basic realm=${this.config.get(APP)}`)
            .send('Authentication Required...');

      if (await authenticateBasicAuth({ userName, password }, request.headers.authorization))
         next();
      else throw new ForbiddenException('Incorrect username or password');
   }
}
