import { Type } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/swagger';
import {
   IsBoolean,
   IsDateString,
   IsMongoId,
   IsNumber,
   IsObject,
   IsOptional,
   Min,
} from 'class-validator';
import { EAllowedUser, EUserApp } from '@common/utils/enum';

//types
export type AllowedUser = keyof typeof EAllowedUser;

export type AllowedApp = keyof typeof EUserApp | 'Any';

//classes
export class UpdateDto {
   @IsBoolean()
   isFailed: boolean;
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

export function CoreDto<T>(classRef: Type<T>): Type<Omit<T, '_id' | 'createdAt' | 'updatedAt'>> {
   class CoreDtoClass extends OmitType(classRef as any, ['_id', 'createdAt', 'updatedAt'] as any) {}

   return CoreDtoClass as any;
}

export function PartialTypeIf<T>(
   isPartial: (cls: any) => boolean,
   classRef: Type<T>,
): Type<Partial<T>> {
   if (isPartial(classRef)) return PartialType(classRef);
   return classRef;
}

export class FindDto {
   @IsBoolean()
   lean?: boolean;
}

export class FindByIdDto extends FindDto {
   @IsMongoId()
   id: string;

   @IsOptional()
   @IsBoolean()
   errorOnNotFound?: boolean;
}
