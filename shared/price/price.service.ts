import CoreService from '@common/core/core.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { CreatePriceDto } from './price.dto';
import Price from './price.schema';
import ProductService from '../product/product.service';
import { ECategory } from '@common/utils/enum';

export default class PriceService extends CoreService<Price> {
   constructor(
      @Inject(REPOSITORY) protected repository: Repository<Price>,
      private readonly productService: ProductService,
   ) {
      super();
   }

   async createPrice({ productId, type, ...dto }: CreatePriceDto) {
      const { data: product } = await this.productService.findById({
         id: productId,
         errorOnNotFound: true,
      });
      return await super.create(
         {
            ...dto,
            type: { ...type, type: ECategory.Price } as any,
            product,
         },
         'type',
      );
   }
}
