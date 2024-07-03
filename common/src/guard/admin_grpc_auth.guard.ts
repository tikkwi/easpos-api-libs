import { AUTH_CREDENTIAL, JWT_SECRET, USER } from '@common/constant';
import { AuthCredentialServiceMethods } from '@common/dto/auth_credential.dto';
import { UserSharedServiceMethods } from '@common/dto/user.dto';
import { decrypt } from '@common/utils/encrypt';
import { authenticateBasicAuth, getServiceToken } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    @Inject(getServiceToken(AUTH_CREDENTIAL))
    private readonly credService: AuthCredentialServiceMethods,
    @Inject(getServiceToken(USER)) private readonly userService: UserSharedServiceMethods,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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
      const { usr } = await this.jwtService.verifyAsync(authHeader, {
        secret: this.config.get(JWT_SECRET),
      });
      const { id } = await decrypt(usr);
      const { data: user } = await this.userService.getUser({ id });
      return !!user; //NOTE: permission will be handler by client's http auth guard
    } catch (error) {
      return false;
    }
  }
}
