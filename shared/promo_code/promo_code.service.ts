import BaseService from '@common/core/base/base.service';
import PromoCode from './promo_code.schema';
import { GetPromoCodeDto } from './promo_code.dto';
import { FindByIdDto } from '@common/dto/core.dto';
import { $dayjs } from '@common/utils/datetime';
import { BadRequestException } from '@nestjs/common';
import { EStatus } from '@common/utils/enum';

export abstract class APromoCodeService extends BaseService<PromoCode> {
   async getPromoCode({ ctx: { connection, session }, code, lean, populate }: GetPromoCodeDto) {
      const repository = await this.getRepository(connection, session);
      return await repository.findOne({
         filter: { code },
         errorOnNotFound: true,
         options: { lean, populate },
      });
   }

   //NOTE: don't allow end user to use this method (controller)
   async expirePromoCode({ ctx: { connection, session }, id }: FindByIdDto) {
      const repository = await this.getRepository(connection, session);
      const {
         data: {
            promotion: { expireAt },
         },
      } = await repository.findOne({
         filter: { promotion: id },
         errorOnNotFound: true,
         options: { lean: true, populate: ['promotion'] },
      });
      if ($dayjs().isBefore($dayjs(expireAt)))
         throw new BadRequestException('Adjustment is not expired yet');
      await repository.updateMany({
         update: { status: EStatus.Expired },
      });
   }
}
