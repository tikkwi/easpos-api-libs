import { CoreService } from '@common/core/service/core.service';
import { Campaign } from '@common/schema/campaign.schema';

export abstract class CampaignService<T extends Campaign = Campaign> extends CoreService<T> {}
