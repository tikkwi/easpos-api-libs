import { REPOSITORY } from '@constant';
import { Repository } from '@core/repository';
import { Inject, Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Injectable()
@Throttle({ default: {} })
export class TmpService {
   constructor(@Inject(REPOSITORY) private readonly repository: Repository<any>) {}

   async create(dto) {
      return await this.repository.create(dto);
   }
}
