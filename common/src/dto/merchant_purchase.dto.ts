import { IsEmail } from 'class-validator';
import { FindByIdDto } from './core.dto';

export class SubMonitorDto extends FindByIdDto {
   @IsEmail()
   merchantMail: string;
}

export interface MerchantPurchaseServiceMethods {
   subMonitor(dto: SubMonitorDto): Promise<{ data: boolean }>;
}
