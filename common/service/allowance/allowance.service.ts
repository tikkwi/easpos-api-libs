import { CoreService } from '@common/core/service/core.service';
import { Allowance } from '@common/schema/allowance.schema';
import { CreateAllowanceDto } from '@common/dto/service/allowance.dto';
import { CampaignService } from '@common/service/campaign/campaign.service';

export abstract class AllowanceService<T extends Allowance = Allowance> extends CoreService<T> {
   protected abstract readonly campaignService: CampaignService;

   async createAllowance<C extends CreateAllowanceDto>(
      { campaignId, ...dto }: CreateAllowanceDto,
      tf?: (d: CreateType<Allowance>) => CreateType<T>,
   ) {
      const { data: campaign } = await this.campaignService.findById({
         id: campaignId,
         errorOnNotFound: true,
      });
      const aDto = { ...dto, campaign };
      return await super.create(tf ? tf(aDto) : (aDto as any));
   }
}
