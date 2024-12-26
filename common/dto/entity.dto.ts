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
   Max,
   Min,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { EMfa, EStatus, EUser, EUserApp } from '@common/utils/enum';
import { regex } from '@common/utils/regex';
import { TmpBlock } from '@shared/user/user.schema';
import { IsAppString } from '../validator';
import { WEEK_DAY } from '../constant';
import { IsPeriod } from '../validator/is_period.validator';
import { OmitType } from '@nestjs/swagger';

export function $Period(
   reqPeriod?: Array<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'>,
) {
   class Period {
      @ValidateIf(() => reqPeriod && reqPeriod.includes('year'))
      @IsNumber()
      @Min(1900)
      @Max(2100)
      year?: number;

      @ValidateIf(() => reqPeriod && reqPeriod.includes('month'))
      @IsNumber()
      @Min(1)
      @Max(12)
      month?: number;

      @ValidateIf(() => reqPeriod && reqPeriod.includes('day'))
      @IsNumber()
      @Min(1)
      @Max(31)
      days?: number;

      @ValidateIf(() => reqPeriod && reqPeriod.includes('hour'))
      @IsNumber()
      @Min(0)
      @Max(23)
      hours?: number;

      @ValidateIf(() => reqPeriod && reqPeriod.includes('minute'))
      @IsNumber()
      @Min(0)
      @Max(59)
      minutes?: number;

      @ValidateIf(() => reqPeriod && reqPeriod.includes('second'))
      @IsNumber()
      @Min(0)
      @Max(59)
      seconds?: number;
   }

   return Period;
}

export class Period extends $Period() {}

export class TimePeriod extends $Period(['hour', 'minute']) {}

export class MonthlyPeriod extends $Period(['year', 'month']) {}

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

/*
 * Period Format (month:day:hour:minute)
 * eg:
 * 00:03:00:00 (every 3rd of the month)
 * 00:00:23:00 (daily 23:00 for every month)
 * */
export class PeriodRange {
   @IsPeriod()
   from: string;

   //TODO: to validate every period segment after from
   @IsPeriod()
   to: string;
}

export class Amount {
   @IsNumber()
   amount: number;

   @IsOptional()
   @IsMongoId()
   unitId?: string; //NOTE: can also be currency
}

export class TimedCredit {
   @IsDateString()
   expireAt: string;

   @IsNumber()
   amount: number;
}

export class FieldValue {
   @IsMongoId()
   id: string;

   @IsNotEmpty()
   value: any;
}

export class Subscription {
   @IsDateString()
   subActiveDate: string;

   @IsEnum(EStatus)
   status: EStatus;

   @IsDateString()
   expireAt: string;

   @IsBoolean()
   sentExpiredMail: boolean;

   @IsBoolean()
   sentPreExpiredMail: boolean;
}

export class MonthlyOperatingSchedule {
   @ValidateNested()
   @Type(() => MonthlyPeriod)
   month: MonthlyPeriod;

   @IsNumber(undefined, { each: true })
   @Min(1, { each: true })
   @Max(31, { each: true })
   days: number[];
}

export class OperatingSchedule {
   @IsOptional()
   @IsAppString('include', { arr: WEEK_DAY }, { each: true })
   weeklyClosedDay?: WeekDay[];

   @IsOptional()
   @IsNumber(undefined, { each: true })
   @Min(0, { each: true })
   @Max(100, { each: true })
   monthlyClosedDay?: number[];

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => MonthlyOperatingSchedule)
   exceptionOpenDays?: MonthlyOperatingSchedule[];

   @IsOptional()
   @ValidateNested()
   @Type(() => TimePeriod)
   openingTime?: TimePeriod;

   @IsOptional()
   @ValidateNested()
   @Type(() => TimePeriod)
   closingTime?: TimePeriod;
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
