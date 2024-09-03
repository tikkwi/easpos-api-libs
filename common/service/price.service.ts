import { CoreService } from '@common/core/service/core.service';
import { CategoryService } from '@common/service/category/category.service';
import { ProductService } from '@common/service/product.service';
import { Price } from '@common/schema/price.schema';

export abstract class PriceService<T extends Price = Price> extends CoreService<T> {
   protected abstract categoryService: CategoryService;
   protected abstract productService: ProductService;

   async create({ categoryDto, productId, ...dto }: any) {
      const { data: category } = await this.categoryService.getCategory(categoryDto);
      const { data: product } = await this.productService.findById({
         id: productId,
         errorOnNotFound: true,
      });
      return await super.create({ ...dto, category, product });
   }
}
