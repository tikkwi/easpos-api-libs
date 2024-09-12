import CoreService from '@common/core/core.service';
import { CreateProductDto, GetProductDto } from './product.dto';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import Product from './product.schema';
import ContextService from '@common/core/context.service';
import { ECategory } from '@common/utils/enum';

export default class ProductService extends CoreService<Product> {
   constructor(@Inject(REPOSITORY) protected repository: Repository<Product>) {
      super();
   }

   async getProduct({ code }: GetProductDto) {
      return this.repository.findOne({
         filter: { qrCode: code },
         errorOnNotFound: true,
      });
   }

   async createProduct({ tags: tagDto, unitId, ...dto }: CreateProductDto) {
      const tags = [];
      if (tagDto) {
         for (const tag of tagDto) {
            tags.push(
               (
                  await ContextService.get('d_categoryService').getCategory({
                     ...tag,
                     type: ECategory.ProductTag,
                  })
               ).data,
            );
         }
      }
      const unit = unitId
         ? (
              await ContextService.get('d_categoryService').findById({
                 id: unitId,
                 errorOnNotFound: true,
              })
           ).data
         : undefined;
      return await super.create({ ...dto, tags, unit }, 'type');
   }
}
