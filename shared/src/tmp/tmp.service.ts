import { CoreService } from '@common/core/core.service';
import { AppService } from '@common/decorator/app_service.decorator';

@AppService()
export class TmpService extends CoreService<any> {
  async create(dto) {
    console.log('hello', dto);
    return await this.repository.create(dto);
  }
}
