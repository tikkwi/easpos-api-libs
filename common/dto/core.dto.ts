import { Type } from '@nestjs/common';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
   IsBoolean,
   IsDateString,
   IsMongoId,
   IsNumber,
   IsOptional,
   IsString,
   Min,
} from 'class-validator';
import { EAllowedUser, EUserApp } from '@common/utils/enum';
import { PopulateOptions, ProjectionType } from 'mongoose';
import { IsRecord } from '../validator';

//types
export type AllowedUser = keyof typeof EAllowedUser;

export type AllowedApp = keyof typeof EUserApp | 'Any';

export class BaseDto {
   ctx?: RequestContext;
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

   @IsRecord()
   sort?: Record<keyof T, any>;
}

export function CoreDto<T>(
   classRef: Type<T>,
): Type<Omit<T, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string } & BaseDto> {
   class CoreDtoClass extends IntersectionType(
      OmitType(classRef as any, ['createdAt', 'updatedAt'] as any),
      PartialType(PickType(classRef as any, ['_id'] as any)),
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

export function SelectionTypeIf<T, K extends keyof T, P extends boolean>(
   selectIf: (cls: any) => boolean,
   classRef: Type<T>,
   select: Array<K>,
   isPick: P,
): P extends true ? Type<Pick<T, K>> : Type<Omit<T, K>> {
   if (selectIf(classRef))
      return (isPick ? PickType(classRef, select) : OmitType(classRef, select)) as P extends true
         ? Type<Pick<T, K>>
         : Type<Omit<T, K>>;
   return classRef;
}

export class FindDto extends BaseDto {
   @IsBoolean()
   lean?: boolean;

   @IsOptional()
   @IsBoolean()
   errorOnNotFound?: boolean;

   @IsOptional()
   populate?: string | string[] | PopulateOptions | PopulateOptions[];

   @IsOptional()
   projection?: ProjectionType<any>;
}

export class FindByIdDto extends FindDto {
   @IsMongoId()
   id: string | ObjectId;
}

export class FindByIdsDto extends FindDto {
   @IsMongoId({ each: true })
   ids: string[];
}

export class FindByCodeDto extends FindDto {
   @IsString()
   code: string;
}
