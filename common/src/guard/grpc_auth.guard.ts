import { AUTH_CREDENTIAL, JWT_SECRET, USER } from '@common/constant';
import { ContextService } from '@common/core/context/context.service';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { UserServiceMethods } from '@common/dto/user.dto';
import { decrypt } from '@common/utils/encrypt';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
   constructor(
      @Inject(getServiceToken(AUTH_CREDENTIAL))
      private readonly credService: AuthCredentialServiceMethods,
      @Inject(getServiceToken(USER)) private readonly userService: UserServiceMethods,
      private readonly jwtService: JwtService,
      private readonly config: ConfigService,
      private readonly context: ContextService,
   ) {}

   async canActivate(context: ExecutionContext) {
      const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
      const authHeader = ctx.metadata.getMap().authorization?.toString();
      const { data: basicAuth } = await this.credService.getAuthCredential({
         url: ctx.getPath(),
         ip: ctx.getPeer().replace(/:\d+$/, ''),
      });

      if (basicAuth) {
         if (!authHeader?.startsWith('Basic ')) return false;
         return await authenticateBasicAuth(basicAuth, authHeader);
      }

      try {
         const { token } = await decrypt(authHeader);
         const { usr, exp } = await this.jwtService.verifyAsync(token, {
            secret: this.config.get(JWT_SECRET),
         });

         const { id } = await decrypt(usr);
         const { data: user } = await this.userService.getUser({ id });
         if (user) {
            const isExpireSoon = dayjs(exp).subtract(1, 'days').isBefore(dayjs());
            if (isExpireSoon)
               this.context.set({ newToken: await this.jwtService.signAsync({ usr }) });
            return true;
         }
         return false; //NOTE: permission will be handler by client's http auth guard
      } catch (error) {
         return false;
      }
   }
}
