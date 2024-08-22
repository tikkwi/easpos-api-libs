import { MerchantSubscription } from '@common/schema/merchant_subscription.schema';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { CoreDto } from '@common/dto/core.dto';

export class SubMonitorDto {
   @IsMongoId({ each: true })
   ids: string[];
}

export class PurchaseMerchantSubscriptionDto extends OmitType(CoreDto(MerchantSubscription), [
   'voucherId',
   'merchant',
   'payment',
]) {
   @IsOptional()
   @IsString()
   allowanceCode: string;
}

export interface MerchantPurchaseServiceMethods {
   subMonitor(dto: SubMonitorDto): Promise<{
      data: { purchases: MerchantSubscription[]; isSubActive: boolean; subEnd?: Date };
   }>;
}
