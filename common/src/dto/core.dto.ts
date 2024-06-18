import { EAllowedUser } from '@common/utils';
import { Type } from '@nestjs/common';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
} from 'class-validator';

//types
export type AllowedUser = keyof typeof EAllowedUser;

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

export class BaseDto {
  @IsNotEmpty()
  request: AppRequest;

  @IsBoolean()
  newTransaction?: boolean;
}

export function CoreDto<T>(
  classRef: Type<T>,
): Type<Omit<T, '_id' | 'createdAt' | 'updatedAt'> & BaseDto> {
  class CoreDtoClass extends IntersectionType(
    BaseDto,
    OmitType(classRef as any, ['_id', 'createdAt', 'updatedAt'] as any),
  ) {}
  return CoreDtoClass as any;
}

export class FindDto extends BaseDto {
  @IsBoolean()
  lean?: boolean;
}

export class FindByIdDto extends FindDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
