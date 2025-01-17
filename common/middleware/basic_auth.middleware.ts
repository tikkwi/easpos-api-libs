import {
   ForbiddenException,
   Inject,
   Injectable,
   InternalServerErrorException,
   NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { authenticateBasicAuth } from '@common/utils/misc';
import { AUTH_CREDENTIAL } from '@common/constant';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { EApp, EAuthCredential } from '@common/utils/enum';
import AppBrokerService from '../core/app_broker/app_broker.service';
import process from 'node:process';
import { getServiceToken } from '../utils/regex';

@Injectable()
export default class BasicAuthMiddleware implements NestMiddleware {
   constructor(
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
      private readonly appBroker: AppBrokerService,
   ) {}

   async use(request: Request, response: Response, next: () => void) {
      const { userName, password } = await this.appBroker.request<BasicAuth>({
         action: (meta) =>
            this.credService.getAuthCredential(
               {
                  ctx: request.body.ctx,
                  type: request.originalUrl.includes('swagger')
                     ? EAuthCredential.Swagger
                     : (process.env['APP'] as EAuthCredential),
               },
               meta,
            ),
         app: EApp.Admin,
         cache: true,
         key: 'a_adm_auth_cred_adm',
      });

      if (!userName) throw new InternalServerErrorException('No Auth Cred');

      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic'))
         response
            .status(401)
            .setHeader('WWW-Authenticate', `Basic realm=${process.env['APP']}`)
            .send('Authentication Required...');

      if (await authenticateBasicAuth({ userName, password }, request.headers.authorization))
         next();
      else throw new ForbiddenException('Incorrect username or password');
   }
}
