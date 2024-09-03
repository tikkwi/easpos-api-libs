import { CoreService } from '@common/core/service/core.service';
import { AllowanceCode } from '@common/schema/allowance_code.schema';
import { CreateAllowanceCodeDto } from '@common/dto/service/allowance_code.dto';
import { AllowanceService } from '@common/service/allowance.service';

export abstract class AllowanceCodeService<
   T extends AllowanceCode = AllowanceCode,
> extends CoreService<T> {
   protected abstract readonly allowanceService: AllowanceService;

   async createAllowanceCode<C extends CreateAllowanceCodeDto>(
      { allowanceId, ...dto }: C,
      tf?: (d: CreateType<AllowanceCode>) => CreateType<T>,
   ) {
      const { data: allowance } = await this.allowanceService.findById({
         id: allowanceId,
         errorOnNotFound: true,
      });
      const acDto = { ...dto, allowance };
      return await super.create(tf ? tf(acDto) : (acDto as any));
   }
}
