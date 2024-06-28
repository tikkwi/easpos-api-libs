import { JWT_SECRET } from '@common/constant';
import { decrypt } from '@common/utils/encrypt';
import { authenticateBasicAuth } from '@common/utils/misc';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialService } from 'src/auth_credential/auth_credential.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly credService: AuthCredentialService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx: ServerUnaryCall<any, any> = (context.switchToRpc() as any).args[2];
    const authHeader = ctx.metadata.getMap().authorization?.toString();
    const { data: basicAuth } = await this.credService.getAuthCredential({
      url: ctx.getPath(),
      ip: ctx.getPeer(),
    });
    if (basicAuth) {
      if (!authHeader?.startsWith('Basic ')) return false;
      return await authenticateBasicAuth(basicAuth, authHeader);
    }
    try {
      const { usr, exp } = await this.jwtService.verifyAsync(authHeader, {
        secret: this.config.get(JWT_SECRET),
      });
      const id = await decrypt(usr);
    } catch (error) {
      return false;
    }
  }
}
