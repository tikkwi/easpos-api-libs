import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import AppService from '@common/decorator/app_service.decorator';
import CoreService from '@common/core/core.service';
import Campaign from './campaign.schema';

@AppService()
export default class CampaignService extends CoreService<Campaign> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<Campaign>) {
      super();
   }
}
