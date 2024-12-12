import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import Campaign from './campaign.schema';
import { CreateCampaignDto } from './campaign.dto';

@AppService()
export default class CampaignService extends ACoreService<Campaign> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Campaign>) {
      super();
   }

   async create({ category, context, ...dto }: CreateCampaignDto) {
      return this.repository.create({
         ...dto,
         ...(category
            ? { type: (await context.get('categoryService').getCategory(category)).data }
            : {}),
      });
   }
}
