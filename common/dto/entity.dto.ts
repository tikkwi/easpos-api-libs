import { Type } from 'class-transformer';
import {
   IsBoolean,
   IsDateString,
   IsEmail,
   IsEnum,
   IsMongoId,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   Matches,
   Max,
   Min,
   ValidateNested,
} from 'class-validator';
import { EStatus, ETime, EUser, EUserApp } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { TmpBlock } from '@shared/user/user.schema';
import { IsAppNumberString } from '../validator';

class UserPermissions {
   @IsString({ each: true })
   urls: string[];

   @IsString({ each: true })
   auxiliaryServices: string[];
}

export class UserServicePermission {
   @IsString()
   service: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => UserPermissions)
   permissions: UserPermissions;
}

export class FieldValue {
   @IsNotEmpty()
   @IsMongoId()
   field: string;

   //NOTE: require manual validation here
   value: any;
}

export class Period {
   @IsNumber()
   @Min(1)
   @Max(31)
   days?: number;

   @IsNumber()
   @Min(0)
   @Max(23)
   hours?: number;

   @IsNumber()
   @Min(0)
   @Max(59)
   minutes?: number;

   @IsNumber()
   @Min(0)
   @Max(59)
   seconds?: number;
}

export class Status {
   @IsEnum(EStatus)
   status: EStatus;

   @IsOptional()
   @IsString()
   remark?: string;

   @IsOptional()
   @IsMongoId()
   adjudicatedBy?: string; //NOTE: null for system manipulation
}

export class MFA {
   @IsAppNumberString()
   code: string;

   @IsDateString()
   expireAt: Date;
}

export class UserProfile {
   @IsMongoId()
   id: string;

   @IsEnum(EUser)
   type: EUser;

   @IsString()
   name?: string;

   @IsEmail()
   mail?: string;

   @Matches(regex.userName)
   userName?: string;
}

export class AuthUser {
   @IsMongoId()
   id: string;

   @IsString()
   userName: string;

   @IsString()
   firstName: string;

   @IsString()
   lastName: string;

   @IsEmail()
   mail: string;

   @IsEnum(EStatus)
   status: EStatus;

   @IsBoolean()
   isOwner: boolean;

   @IsEnum(EUser)
   type: EUser;

   @IsEnum(EUserApp)
   app: EUserApp;

   @IsOptional()
   @ValidateNested()
   @Type(() => TmpBlock)
   tmpBlock: TmpBlock;

   permissions: Record<string, number>;
}

export class UserRole {
   @IsString()
   @IsNotEmpty()
   name: string;

   @IsOptional()
   @IsMongoId({ each: true })
   permissions: string[];
}

export class AppliedAllowance {}

export class Payment {
   @IsNumber()
   price: number;

   @IsOptional()
   @IsMongoId()
   allowance?: string;

   @IsOptional()
   @IsMongoId()
   paymentMethod?: string;

   @IsNumber()
   netPrice: number;
}

export class TimeRange {
   @IsEnum(ETime)
   type: ETime;

   //NOTE: manual validate wrt type
   @IsNumber()
   from: number;

   //NOTE: manual validate wrt type
   @IsNumber()
   to: number;
}

export class ProductPurchased {
   @IsString() //NOTE:qr-code
   product: string;

   @IsNumber()
   quantity: number;
}

export class Cash {
   @IsNumber()
   amount: number;

   @IsMongoId()
   currencyId: string;
}

export class Price {
   @IsMongoId()
   typeId: string;

   @IsBoolean()
   basePrice: number;

   @IsMongoId()
   currencyId: string;
}

export class TimedCredit {
   @IsDateString()
   expireAt: string;

   @IsNumber()
   amount: number;
}
