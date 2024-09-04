import { CoreService } from '@common/core/service/core.service';
import { Unit } from '@common/schema/unit.schema';
import { GetBaseAmountDto } from '@common/dto/service/unit.dto';

export abstract class UnitService<T extends Unit = Unit> extends CoreService<T> {
   async getBaseAmount({ amount, unitId }: GetBaseAmountDto) {
      const {
         data: { baseUnit },
      } = await this.findById({ id: unitId, errorOnNotFound: true });
      return { data: amount * baseUnit };
   }
}
