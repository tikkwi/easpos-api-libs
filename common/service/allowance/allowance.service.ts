import { CoreService } from '@common/core/service/core.service';
import { Allowance } from '@common/schema/allowance.schema';
import { CreateAllowanceDto } from '@common/dto/service/allowance.dto';
import { CampaignService } from '@common/service/campaign/campaign.service';

export abstract class AllowanceService extends CoreService<Allowance> {
   protected abstract readonly campaignService: CampaignService;

   async create({ campaignId, ...dto }: CreateAllowanceDto) {
      const { data: campaign } = await this.campaignService.findById({
         id: campaignId,
         errorOnNotFound: true,
      });
      return await super.create({ ...dto, campaign });
   }
}
