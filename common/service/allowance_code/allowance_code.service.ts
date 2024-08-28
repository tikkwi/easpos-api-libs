import { CoreService } from '@common/core/service/core.service';
import { AllowanceCode } from '@common/schema/allowance_code.schema';
import { CreateAllowanceCodeDto } from '@common/dto/service/allowance_code.dto';
import { AllowanceService } from '@common/service/allowance/allowance.service';

export abstract class AllowanceCodeService extends CoreService<AllowanceCode> {
   protected abstract readonly allowanceService: AllowanceService;

   async create({ allowanceId, ...dto }: CreateAllowanceCodeDto) {
      const allowance = await this.allowanceService.findById({
         id: allowanceId,
         errorOnNotFound: true,
      });
      return await super.create({ ...dto, allowance });
   }
}
