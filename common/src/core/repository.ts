import { PAGE_SIZE } from '@common/constant';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

export class Repository<T> {
  constructor(public readonly model: Model<T>) {}

  async create(dto: CreateType<T>) {
    const data = await new this.model(dto).save();
    const rollback = async () => await this.model.findByIdAndDelete(data.id);

    return { data: data as Document<unknown, unknown, T> & T, rollback };
  }

  getPaginationOption({
    page,
    startDate,
    endDate,
    pageSize,
    sort,
  }: PaginationType<T>) {
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

  async findOne({
    filter,
    projection,
    options = {},
  }: Omit<FindType<T>, 'pagination'>) {
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
    if (!id && !filter)
      throw new BadRequestException('Require filter to update');

    const prev = id
      ? await this.model.findById(id, null)
      : await this.model.findOne(filter, null);

    if (!prev) throw new NotFoundException('Not found');

    const updateOptions: [UpdateQuery<T>, QueryOptions<T>] = [
      { ...update, updatedAt: new Date() },
      { ...options, lean: true, new: true },
    ];
    const data = id
      ? await this.model.findByIdAndUpdate(id, ...updateOptions)
      : await this.model.findOneAndUpdate(filter, ...updateOptions);

    const rollback = async () => {
      prev.isNew = false;
      await prev.save();
    };

    return { prev, data, rollback };
  }

  async updateMany({
    ids,
    update,
  }: Omit<UpdateType<T>, 'id' | 'filter'> & { ids: string[] }) {
    const prev = await this.model.find({ _id: { $in: ids } }, null);
    if (!prev || !prev.length) throw new NotFoundException('Not Found');

    await this.model.updateMany(
      { _id: { $in: ids } },
      { ...update, updatedAt: new Date() },
    );

    const data = await this.model.find({ _id: { $in: ids } }, null, {
      lean: true,
    });

    const rollback = async () => {
      for (const doc of prev) {
        doc.isNew = false;
        await doc.save();
      }
    };

    return { prev, data, rollback };
  }

  async delete(id: string) {
    const data = await this.model.findById(id);
    await this.model.findByIdAndDelete(id);
    const rollback = async () => await data.save();
    return { rollback };
  }

  async custom(action: (model: Model<T>) => any) {
    return action(this.model);
  }
}
