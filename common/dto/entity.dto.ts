import { Type } from 'class-transformer';
import { Type as $Type } from '@nestjs/common';
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
   ValidateNested,
} from 'class-validator';
import { EMfa, EStatus, EUser, EUserApp } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { TmpBlock } from '@shared/user/user.schema';
import { IsAppString } from '../validator';
import { OmitType } from '@nestjs/swagger';
import { BaseDto } from './core.dto';

export function AppSchema<T>(classRef: $Type<T>): $Type<Omit<T, '_id'> & { id: string }> {
   class AS extends OmitType(classRef as any, ['_id'] as any) {
      @IsMongoId()
      id: string;
   }

   return AS as any;
}

export class MFA {
   @IsAppString('number')
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

   @IsString({ each: true })
   permissions: Array<string>;
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

//NOTE: may neglect year/month/day wrt context
export class PeriodRange {
   @IsDateString()
   from: string;

   //TODO: to validate every period segment after from
   @IsDateString()
   to: string;
}

export class Amount {
   @IsNumber()
   amount: number;

   @IsOptional()
   @IsMongoId()
   unitId?: string; //NOTE: can also be currency
}

export class FieldValue extends BaseDto {
   @IsMongoId()
   id: string;

   @IsNotEmpty()
   value: any;
}

export class Dimension {
   @ValidateNested()
   @Type(() => Amount)
   x: Amount;

   @ValidateNested()
   @Type(() => Amount)
   y: Amount;

   @ValidateNested()
   @Type(() => Amount)
   z: Amount;
}

export class BasicInfo {
   @IsString()
   name: string;

   @IsOptional()
   @IsString()
   description?: string;

   @IsOptional()
   @IsString({ each: true })
   attachments?: Array<string>;
}
