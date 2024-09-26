import { CreateAllowanceCodeDto } from './allowance_code.dto';
import CoreService from '@common/core/core.service';
import AllowanceCode from './allowance_code.schema';
import AllowanceService from '../allowance/allowance.service';
import AppService from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { FindByCodeDto } from '@common/dto/core.dto';

@AppService()
export default class AllowanceCodeService extends CoreService<AllowanceCode> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<AllowanceCode>,
      private readonly allowanceService: AllowanceService,
   ) {
      super();
   }

   async getAllowanceByCoupon({ code }: FindByCodeDto) {
      return {
         data: (
            await this.repository.findOne({
               filter: { code },
               errorOnNotFound: true,
               options: { populate: ['allowance'] },
            })
         ).data.allowance,
      };
   }

   async createAllowanceCode({ allowanceId, ...dto }: CreateAllowanceCodeDto) {
      const { data: allowance } = await this.allowanceService.findById({
         id: allowanceId,
         errorOnNotFound: true,
      });
      return await super.create({ ...dto, allowance });
   }
}
