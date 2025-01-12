import { FindByIdDto, FindByIdsDto } from '../../dto/core.dto';
import BaseSchema from './base.schema';
import Repository from '../repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SCHEMA } from '../../constant';
import { Connection } from 'mongoose';

@Injectable()
export default class BaseService<T = BaseSchema> {
   protected readonly moduleRef: ModuleRef;

   async getRepository(connection: Connection, session: ClientSession): Promise<Repository<T>> {
      return new Repository(
         connection.model(this.constructor.name, this.moduleRef.get(SCHEMA)),
         session,
      );
   }

   async findById({
      ctx: { connection, session },
      id,
      errorOnNotFound = true,
      ...options
   }: FindByIdDto) {
      const repository = await this.getRepository(connection, session);
      return repository.findOne({
         id,
         options: { errorOnNotFound, ...options },
      });
   }

   async findByIds({
      ctx: { connection, session },
      ids,
      errorOnNotFound = true,
      ...options
   }: FindByIdsDto) {
      const repository = await this.getRepository(connection, session);
      const { data } = await repository.find({
         filter: { _id: { $in: ids } },
         options,
      });
      if (errorOnNotFound && data.length !== ids.length) throw new NotFoundException();
      return { data };
   }
}
