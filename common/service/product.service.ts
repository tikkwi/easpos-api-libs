import { CoreService } from '@common/core/service/core.service';
import { Product } from '@common/schema/product.schema';
import { GetProductDto } from '@common/dto/service/product.dto';

export abstract class ProductService<T extends Product = Product> extends CoreService<T> {
   async getProduct({ code }: GetProductDto) {
      return this.repository.findOne({
         filter: { qrCode: code },
         errorOnNotFound: true,
      });
   }
}
