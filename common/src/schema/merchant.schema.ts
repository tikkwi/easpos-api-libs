import { AppProp } from '@common/decorator';
import { MetadataValue } from '@common/dto';
import { EStatus, ESubscription } from '@common/helper';
import {
  Address,
  BaseSchema,
  Category,
  MerchantPurchase,
  User,
} from '@common/schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';

export class Merchant extends BaseSchema {
  @AppProp({ type: String })
  name: string;

  @AppProp({ type: String })
  @IsEmail()
  mail: string;

  @AppProp({ type: String })
  @IsPhoneNumber()
  mobileNo: string;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
  type: Category;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address' })
  address: Address;

  @AppProp({ type: String, enum: ESubscription })
  subscriptionType: ESubscription;

  @ValidateIf((o) =>
    [ESubscription.Dedicated, ESubscription.DedicatedDB].includes(
      o.subscriptionType,
    ),
  )
  @AppProp({ type: String })
  dbUri?: string;

  @AppProp({ type: String, enum: EStatus, immutable: false })
  status: EStatus;

  @AppProp({ type: SchemaTypes.Mixed })
  @Type(() => MetadataValue)
  metadata: MetadataValue;

  @AppProp({
    type: SchemaTypes.ObjectId,
    ref: 'MerchantPurchase',
    immutable: false,
  })
  activePurchase?: MerchantPurchase;

  @AppProp({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: User;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
