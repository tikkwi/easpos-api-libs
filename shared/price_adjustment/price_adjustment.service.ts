import BaseService from '@common/core/base/base.service';
import { FindByIdDto } from '@common/dto/core.dto';
import { $dayjs } from '@common/utils/datetime';
import APriceAdjustment from './price_adjustment.schema';
import { BadRequestException } from '@nestjs/common';
import { EStatus } from '@common/utils/enum';
import APromoCodeService from '../promo_code/promo_code.service';
import APromoCode from '../promo_code/promo_code.schema';

export default abstract class APriceAdjustmentService<
   T extends APriceAdjustment,
> extends BaseService<T> {
   protected abstract promoCodeService: APromoCodeService<APromoCode>;

   async expireAdjustment({ ctx, id }: FindByIdDto) {
      const { data: adjustment } = await this.findById({ ctx, id, lean: false });
      if ($dayjs().isBefore($dayjs(adjustment.expireAt)))
         throw new BadRequestException('Adjustment is not expired yet');
      adjustment.status = EStatus.Expired;
      await this.promoCodeService.expirePromoCode({ ctx, id });
      await adjustment.save({ session: ctx.session });
      return { data: adjustment };
   }
}
