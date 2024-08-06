import { ServicePermission } from '@common/schema/service_permission.schema';
import { EStatus, ESubscription, EUser } from '@common/utils/enum';
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
   Max,
   Min,
   ValidateNested,
} from 'class-validator';

class UserPermissions {
   @IsString({ each: true })
   urls: string[];

   @IsString({ each: true })
   auxillaryServices: string[];
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

export class User {
   @IsNotEmpty()
   @IsEnum(EUser)
   type: EUser;

   @IsString()
   name?: string;

   @IsEmail()
   email?: string;

   @IsMongoId()
   user?: string;
}

export class AuthUser {
   @IsMongoId()
   id?: string;

   @IsString()
   userName: string;

   @IsString()
   firstName: string;

   @IsString()
   lastName: string;

   @IsEmail()
   mail: string;

   @IsEnum(Status)
   userStatus: EStatus;

   @IsBoolean()
   isOwner: boolean;

   @IsEnum(EUser)
   type: EUser;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => UserServicePermission)
   servicePermissions: UserServicePermission[];

   @IsMongoId()
   merchant?: string;

   @IsEnum(ESubscription)
   merchantSubType: ESubscription;

   @IsEnum(EStatus)
   merchantStatus: EStatus;

   @IsOptional()
   @IsDateString()
   merchantEndSub?: Date;
}
