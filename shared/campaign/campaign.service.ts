import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import Campaign from './campaign.schema';
import { CreateCampaignDto } from './campaign.dto';
import CategoryService from '../category/category.service';

@AppService()
export default class CampaignService extends BaseService<Campaign> {
   constructor(private readonly categoryService: CategoryService) {
      super();
   }

   async create({ category, ...dto }: CreateCampaignDto) {
      const repository = await this.getRepository();
      return repository.create({
         ...dto,
         ...(category ? { type: (await this.categoryService.getCategory(category)).data } : {}),
      });
   }
}
