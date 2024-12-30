import { FindByIdDto, FindByIdsDto } from '../../dto/core.dto';
import BaseSchema from './base.schema';
import Repository from '../repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import RequestContextService from '../request_context/request_context_service';
import { ModuleRef } from '@nestjs/core';
import { SCHEMA } from '../../constant';

@Injectable()
export default class BaseService<T = BaseSchema> {
   protected readonly moduleRef: ModuleRef;

   async getRepository(): Promise<Repository<T>> {
      const context = await this.moduleRef.resolve(RequestContextService);
      return new Repository(
         context.getConnection().model(this.constructor.name, this.moduleRef.get(SCHEMA)),
         this.moduleRef,
      );
   }

   async findById({ id, errorOnNotFound = true, ...options }: FindByIdDto) {
      const repository = await this.getRepository();
      return repository.findOne({
         id,
         options: { errorOnNotFound, ...options },
      });
   }

   async findByIds({ ids, errorOnNotFound = true, ...options }: FindByIdsDto) {
      const repository = await this.getRepository();
      const { data } = await repository.find({
         filter: { _id: { $in: ids } },
         options,
      });
      if (errorOnNotFound && data.length !== ids.length) throw new NotFoundException();
      return { data };
   }
}
