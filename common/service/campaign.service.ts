import { CoreService } from '@common/core/core.service';
import { Campaign } from '@common/schema/campaign.schema';
import { CreateCampaignDto } from '@common/dto/service/campaign.dto';
import { CategoryService } from '@common/service/category/category.service';

export abstract class CampaignService<T extends Campaign = Campaign> extends CoreService<T> {
   protected abstract categoryService: CategoryService;

   async createCampaign<C extends CreateCampaignDto>(
      { category, ...dto }: C,
      tf?: (d: CreateType<Campaign>) => CreateType<T>,
   ) {
      const { data: type } = await this.categoryService.getCategory(category);
      const cDto = { ...dto, type };
      return super.create(tf ? tf(cDto) : (cDto as any));
   }
}
