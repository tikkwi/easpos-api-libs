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
import { EField, EMfa, EStatus, ETime, EUser, EUserApp } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { TmpBlock } from '@shared/user/user.schema';
import { IsAppNumberString } from '../validator';

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

export class MFA {
   @IsAppNumberString()
   code: string;

   @IsDateString()
   expireAt: Date;

   @IsEnum(EMfa)
   type: EMfa;
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

export class TimedCredit {
   @IsDateString()
   expireAt: string;

   @IsNumber()
   amount: number;
}

export class Field {
   @IsString() //NOTE: use this field to meta value
   @Matches(regex.fieldName)
   name: string;

   @IsEnum(EField)
   type: EField;

   @IsBoolean()
   isOptional: boolean;

   @IsBoolean()
   isArray: boolean;

   @IsOptional()
   @IsNumber()
   priority: number; //NOTE: might use this field to dynamic render custom fields on UI

   @IsOptional()
   @IsString()
   remark?: string;
}

export class FieldValue {
   @IsString()
   @Matches(regex.fieldName)
   name: string;

   @IsNotEmpty()
   value: any;
}
