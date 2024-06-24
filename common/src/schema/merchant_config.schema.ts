import { Schema } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class MerchantConfig extends BaseSchema {}
