import { Type } from '@nestjs/common';
import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import {
   IsBoolean,
   IsDateString,
   IsMongoId,
   IsNumber,
   IsObject,
   IsOptional,
   IsString,
   Min,
} from 'class-validator';
import { EAllowedUser, EUserApp } from '@common/utils/enum';
import ContextService from '../core/context/context.service';

//types
export type AllowedUser = keyof typeof EAllowedUser;

export type AllowedApp = keyof typeof EUserApp | 'Any';

export class BaseDto {
   context: ContextService;
}

export class PaginationDto<T> {
   @IsNumber()
   @Min(1)
   page?: number;

   @IsDateString()
   startDate?: string;

   @IsDateString()
   endDate?: string;

   @IsNumber()
   @Min(1)
   pageSize?: number;

   //NOTE: sanitize manually
   @IsObject()
   sort?: Record<keyof T, any>;
}

export function CoreDto<T>(
   classRef: Type<T>,
): Type<BaseDto & Omit<T, '_id' | 'createdAt' | 'updatedAt' | 'app'>> {
   class CoreDtoClass extends IntersectionType(
      BaseDto,
      OmitType(classRef as any, ['_id', 'createdAt', 'updatedAt', 'app'] as any),
   ) {}

   return CoreDtoClass as any;
}

export function PartialTypeIf<T>(
   isPartial: (cls: any) => boolean,
   classRef: Type<T>,
): Type<Partial<T>> {
   if (isPartial(classRef)) return PartialType(classRef);
   return classRef;
}

export class FindDto extends PartialType(BaseDto) {
   @IsBoolean()
   lean?: boolean;

   @IsOptional()
   @IsBoolean()
   errorOnNotFound?: boolean;

   @IsOptional()
   @IsString({ each: true })
   populate?: string[];
}

export class FindByIdDto extends FindDto {
   @IsMongoId()
   id: string | ObjectId;
}

export class FindByCodeDto extends FindDto {
   @IsString()
   code: string;
}
