import { IsEnum, IsMongoId, IsNotEmpty, ValidateIf } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { BaseDto, FindDto } from './core.dto';
import { Metadata } from '@common/schema/metadata.schema';
import { MetadataValue } from './entity.dto';
import { EEntityMetadata, EField } from '@common/utils/enum';
export class GetMetadataDto extends FindDto {
  @IsMongoId()
  id?: string;

  @ValidateIf((o) => !!!o.id)
  @IsNotEmpty()
  @IsEnum(EEntityMetadata)
  entity?: EEntityMetadata;
}

export class IsValidDto extends BaseDto {
  value: any;

  @IsNotEmpty()
  @IsEnum(EField)
  field: EField;
}

export class ValidateMetaValueDto extends IntersectionType(MetadataValue, BaseDto) {
  @ValidateIf((o) => !!!o.metadata)
  @IsNotEmpty()
  @IsEnum(EEntityMetadata)
  entity?: EEntityMetadata;
}

export type MetadataReturn = { data: Metadata };

export interface MetadataServiceMethods {
  getMetadata(dto: GetMetadataDto): Promise<MetadataReturn>;
  isValid(dto: IsValidDto): Promise<{ data: boolean }>;
  validateMetaValue(dto: ValidateMetaValueDto): Promise<void>;
}
