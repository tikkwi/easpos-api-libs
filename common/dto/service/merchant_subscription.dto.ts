import { PurchasedMerchantSubscription } from '@global_schema/purchased_merchant_subscription.schema';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { CoreDto } from '@global_dto/core.dto';

export class SubMonitorDto {
   @IsMongoId({ each: true })
   ids: string[];
}

export class PurchaseMerchantSubscriptionDto extends OmitType(
   CoreDto(PurchasedMerchantSubscription),
   ['voucherId', 'merchant', 'payment'],
) {
   @IsOptional()
   @IsString()
   allowanceCode: string;

   @IsMongoId()
   id: string;
}

export interface MerchantPurchaseServiceMethods {
   subMonitor(dto: SubMonitorDto): Promise<{
      data: { purchases: PurchaseMerchantSubscriptionDto[]; isSubActive: boolean; subEnd?: Date };
   }>;

   purchaseSubscription(dto: PurchaseMerchantSubscriptionDto): Promise<void>;
}
