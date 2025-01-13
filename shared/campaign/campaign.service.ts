import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import Campaign from './campaign.schema';
import { CreateCampaignDto } from './campaign.dto';
import CategoryService from '../category/category.service';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class CampaignService extends BaseService<Campaign> {
   constructor(
      protected readonly moduleRef: ModuleRef,
      private readonly categoryService: CategoryService,
   ) {
      super();
   }

   async create({ ctx, category, ...dto }: CreateCampaignDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);
      return repository.create({
         ...dto,
         ...(category
            ? { type: (await this.categoryService.getCategory({ ctx, ...category })).data }
            : {}),
      });
   }
}
