import { CreateAllowanceCodeDto } from './allowance_code.dto';
import CoreService from '@common/core/core.service';
import AllowanceCode from './allowance_code.schema';
import AllowanceService from '../allowance/allowance.service';
import AppService from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';

@AppService()
export default class AllowanceCodeService extends CoreService<AllowanceCode> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<AllowanceCode>,
      private readonly allowanceService: AllowanceService,
   ) {
      super();
   }

   async createAllowanceCode({ allowanceId, ...dto }: CreateAllowanceCodeDto) {
      const { data: allowance } = await this.allowanceService.findById({
         id: allowanceId,
         errorOnNotFound: true,
      });
      return await super.create({ ...dto, allowance });
   }
}
