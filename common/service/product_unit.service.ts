import { CoreService } from '@common/core/core.service';
import { ProductUnit } from '@common/schema/product_unit.schema';
import { ProductService } from '@common/service/product.service';
import { GetProductDto } from '@common/dto/service/product.dto';

export abstract class ProductUnitService<
   T extends ProductUnit = ProductUnit,
> extends CoreService<T> {
   protected abstract productService: ProductService;

   async getProductUnit({ code }: GetProductDto) {
      return this.repository.findOne({
         filter: { qrCode: code },
         errorOnNotFound: true,
         options: { populate: ['product'] },
      });
   }
}
