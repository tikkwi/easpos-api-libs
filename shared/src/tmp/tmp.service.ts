import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TmpService {
  constructor(@Inject(REPOSITORY) private readonly repository: Repository<any>) {}

  async create(dto) {
    console.log('hello', dto);
    // return await this.repository.create(dto);
  }
}
