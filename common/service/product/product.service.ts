import { CoreService } from '@common/core/service/core.service';
import { Product } from '@common/schema/product.schema';

export abstract class ProductService<T extends Product = Product> extends CoreService<T> {}
