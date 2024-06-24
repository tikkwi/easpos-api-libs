import { C_SESSION, PAGE_SIZE } from '@common/constant';
import { BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Document, Model } from 'mongoose';
import { ContextService } from './context/context.service';

export class Repository<T> {
  constructor(
    private readonly model: Model<T>,
    private readonly context: ContextService,
  ) {}

  async create(dto: CreateType<T>) {
    return { data: (await new this.model(dto).save()) as Document<unknown, unknown, T> & T };
  }

  getPaginationOption({ page, startDate, endDate, pageSize, sort }: PaginationType<T>) {
    const pag = {};
    const fil = {};
    if (sort) pag['sort'] = sort;
    pag['skip'] = page ?? 1 * pageSize ?? PAGE_SIZE;
    pag['limit'] = pageSize ?? PAGE_SIZE;
    if (startDate) fil['createdAt'] = { $gte: startDate };
    if (endDate) fil['endDate'] = { $lte: endDate };

    return { pag, fil };
  }

  async find({ filter, projection, options, pagination }: FindType<T>) {
    const { pag, fil } = this.getPaginationOption(pagination);
    const docs = await this.model.find({ ...filter, ...fil }, projection, {
      lean: true,
      ...options,
      ...pag,
    });

    const response = { data: docs, total: await this.model.countDocuments() };

    return response;
  }

  async findOne({ filter, projection, options = {} }: Omit<FindType<T>, 'pagination'>) {
    return {
      data: await this.model.findOne(filter, projection, {
        lean: true,
        ...options,
      }),
    };
  }

  async findById({
    id,
    projection,
    options = {},
  }: Omit<FindType<T>, 'filter' | 'pagination'> & { id: string }) {
    return {
      data: await this.model.findById(id, projection, {
        lean: true,
        ...options,
      }),
    };
  }

  async findAndUpdate({ id, filter, options, update }: UpdateType<T>) {
    if (!id && !filter) throw new BadRequestException('Require filter to update');

    const prev = id ? await this.model.findById(id, null) : await this.model.findOne(filter, null);

    if (!prev) throw new NotFoundException('Not found');

    const updateOptions: [UpdateQuery<T>, QueryOptions<T>] = [
      { ...update, updatedAt: new Date() },
      { ...options, lean: true, new: true, session: this.context.get(C_SESSION) },
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
      { session: this.context.get(C_SESSION) },
    );

    const data = await this.model.find({ _id: { $in: ids } }, null, {
      lean: true,
    });

    return { prev, data };
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id, { session: this.context.get(C_SESSION) });
  }

  async custom(action: (model: Model<T>) => any) {
    return action(this.model);
  }
}
