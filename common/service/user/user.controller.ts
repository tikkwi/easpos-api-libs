import { UserService } from '@common/service/user/user.service';

export abstract class UserController {
   protected abstract service: UserService;
}
