import { AUTH_CREDENTIAL, GRPC_AUTH, JWT_SECRET, USER } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { decrypt } from '@common/utils/encrypt';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { GrpcAuthType } from '@common/dto/core.dto';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { AuthCredential } from '@common/schema/auth_credential.schema';
import { EApp, EAuthCredential } from '@common/utils/enum';
import { UserServiceMethods } from '@common/dto/user.dto';
import { isPeriodExceed } from '@common/utils/datetime';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
   constructor(
      private readonly jwtService: JwtService,
      private readonly config: ConfigService,
      private readonly context: ContextService,
      private readonly reflector: Reflector,
      private readonly broker: AppBrokerService,
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
      @Inject(getServiceToken(USER)) private readonly userService: UserServiceMethods,
   ) {}

   async canActivate(context: ExecutionContext) {
      const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
      const authHeader = ctx.metadata.getMap().authorization?.toString();
      const isBasicAuth = authHeader?.startsWith('Basic ');

      const auth = this.reflector.get<GrpcAuthType>(GRPC_AUTH, context.getHandler());
      if ((auth === 'Basic' && !isBasicAuth) || (auth === 'Token' && isBasicAuth)) return false;

      if (auth === 'Basic') {
         //TODO: to check path
         const basicAuth = await this.broker.request<AuthCredential>({
            basicAuth: true,
            action: (meta) =>
               this.credService.getAuthCredential(
                  {
                     url: ctx.getPath(),
                     ip: ctx.getPeer().replace(/:\d+$/, ''),
                  },
                  meta,
               ),
            cache: true,
            key: `lcl_cre_${EAuthCredential.AdminRpc}`,
            app: EApp.Admin,
         });
         return await authenticateBasicAuth(basicAuth, authHeader);
      }

      try {
         const { token } = await decrypt(authHeader);
         const { usr, exp } = await this.jwtService.verifyAsync(token, {
            secret: this.config.get(JWT_SECRET),
         });

         const { id, type } = await decrypt(usr);
         const { data: user } = await this.userService.getUser({ id, type });
         if (user) {
            const [isExpire, _, isExpireSoon] = isPeriodExceed(exp, undefined, 1);

            if (isExpireSoon)
               this.context.set({ newToken: await this.jwtService.signAsync({ usr }) });

            return !isExpire;
         }
         return false; //NOTE: permission will be handler by client's http auth guard
      } catch (_) {
         return false;
      }
   }
}
