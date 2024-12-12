import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { APP, PAGE_SIZE } from '@common/constant';
import { ModuleRef } from '@nestjs/core';
import ContextService from './context/context.service';
import * as process from 'node:process';

export default class Repository<T> {
   constructor(
      private readonly model: Model<T>,
      private readonly moduleRef: ModuleRef,
   ) {}

   async create(dto: CreateType<T>) {
      const context = await this.moduleRef.resolve(ContextService);
      return {
         data: (await new this.model({ ...dto, app: process.env[APP] }).save({
            session: context.get('session'),
         })) as Document<unknown, unknown, T> & T,
      };
   }

   async find({ filter, projection, options, pagination }: FindType<T>) {
      let pag = {},
         fil = {};
      if (pagination) ({ pag, fil } = this.getPaginationOption(pagination));
      const docs = await this.model.find({ ...filter, ...fil }, projection, {
         lean: true,
         ...options,
         ...pag,
      });

      return { data: docs, total: await this.model.countDocuments() };
   }

   async findOne({
      projection,
      options,
      errorOnNotFound,
      ...rest
   }: Omit<FindType<T>, 'filter' | 'pagination'> &
      (
         | {
              id: string | ObjectId;
           }
         | Pick<FindType<T>, 'filter'>
      )) {
      const $rest = rest as any;
      const $options = [projection, { lean: true, ...options }];
      const data = await ($rest.filter
         ? this.model.findOne($rest.filter, ...$options)
         : this.model.findById($rest.id, ...$options));

      if (!data && errorOnNotFound) throw new NotFoundException();

      return { data };
   }

   async findAndUpdate({ id, filter, options, update }: UpdateType<T>) {
      if (!id && !filter) throw new BadRequestException('Require filter to update');
      const context = await this.moduleRef.resolve(ContextService);

      const prev = id
         ? await this.model.findById(id, null)
         : await this.model.findOne(filter, null);

      if (!prev) throw new NotFoundException();

      const updateOptions: [UpdateQuery<T>, QueryOptions<T>] = [
         { ...update, updatedAt: new Date() },
         { lean: true, new: true, ...options, session: context.get('session') },
      ];
      const data = id
         ? await this.model.findByIdAndUpdate(id, ...updateOptions)
         : await this.model.findOneAndUpdate(filter, ...updateOptions);

      return { prev, data };
   }

   async updateMany({ ids, update }: Omit<UpdateType<T>, 'id' | 'filter'> & { ids: string[] }) {
      const context = await this.moduleRef.resolve(ContextService);
      const prev = await this.model.find({ _id: { $in: ids } }, null);
      if (!prev || !prev.length) throw new NotFoundException('Not Found');

      await this.model.updateMany(
         { _id: { $in: ids } },
         { ...update, updatedAt: new Date() },
         { session: context.get('session') },
      );

      const data = await this.model.find({ _id: { $in: ids } }, null, {
         lean: true,
      });

      return { prev, data };
   }

   async delete(id: string) {
      const context = await this.moduleRef.resolve(ContextService);
      return {
         data: await this.model.findByIdAndDelete(id, { session: context.get('session') }),
      };
   }

   async custom(action: (model: Model<T>) => any) {
      return action(this.model);
   }

   private getPaginationOption({ page, startDate, endDate, pageSize, sort }: PaginationType<T>) {
      const pag = {};
      const fil = {};
      if (sort) pag['sort'] = sort;
      pag['skip'] = page ?? pageSize ?? PAGE_SIZE;
      pag['limit'] = pageSize ?? PAGE_SIZE;
      if (startDate) fil['createdAt'] = { $gte: startDate };
      if (endDate) fil['endDate'] = { $lte: endDate };

      return { pag, fil };
   }
}
