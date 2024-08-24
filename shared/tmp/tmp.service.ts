import { Inject, Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';

@Injectable()
@Throttle({ default: {} })
export class TmpService {
   constructor(@Inject(REPOSITORY) private readonly repository: Repository<any>) {}

   async create(dto) {
      return await this.repository.create(dto);
   }
}
