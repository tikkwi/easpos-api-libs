import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PAGE_SIZE } from '@common/constant';

export default class Repository<T> {
   constructor(
      private readonly model: Model<T>,
      private readonly session: ClientSession,
   ) {}

   async create(dto: CreateType<T>) {
      return { data: (await this.model.create([dto], { session: this.session }))[0] };
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

      const prev = id
         ? await this.model.findById(id, null)
         : await this.model.findOne(filter, null);

      if (!prev) throw new NotFoundException();

      const updateOptions: [UpdateQuery<T>, QueryOptions<T>] = [
         { ...update, updatedAt: new Date() },
         { lean: true, returnDocument: 'after', ...options, session: this.session },
      ];
      const data = id
         ? await this.model.findByIdAndUpdate(id, ...updateOptions)
         : await this.model.findOneAndUpdate(filter, ...updateOptions);

      return { prev, data };
   }

   async updateMany({ ids, update }: Omit<UpdateType<T>, 'id' | 'filter'> & { ids: string[] }) {
      const prev = await this.model.find({ _id: { $in: ids } }, null);
      if (!prev || !prev.length) throw new NotFoundException('Not Found');

      await this.model.updateMany(
         { _id: { $in: ids } },
         { ...update, updatedAt: new Date() },
         { session: this.session },
      );

      const data = await this.model.find({ _id: { $in: ids } }, null, {
         lean: true,
      });

      return { prev, data };
   }

   async delete(id: string) {
      return {
         data: await this.model.findByIdAndDelete(id, { session: this.session }),
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
