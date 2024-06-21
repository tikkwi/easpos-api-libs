import { GrpcHandler } from '@common/decorator/grpc_handler.decorator';
import { UserService } from './user.service';
import { GetUserDto } from '@common/dto/user.dto';
import { FindByIdDto } from '@common/dto/core.dto';

@GrpcHandler()
export class UserGrpcController {
  protected readonly service: UserService;

  async getUser(dto: GetUserDto) {
    return this.service.getUser(dto);
  }

  async userWithAuth(dto: FindByIdDto) {
    return this.service.userWithAuth(dto);
  }
}
