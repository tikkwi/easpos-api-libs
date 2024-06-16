import { EEntityMetadata, EField } from '@app/helper';
import { Metadata } from '@app/schema';
import { FindDto, MetadataValue } from '@app/types';
import { IsEnum, IsMongoId, IsNotEmpty, ValidateIf } from 'class-validator';

export class GetMetadataDto extends FindDto {
  @IsMongoId()
  id?: string;

  @ValidateIf((o) => !!!o.id)
  @IsNotEmpty()
  @IsEnum(EEntityMetadata)
  entity?: EEntityMetadata;
}

export class IsValidDto {
  value: any;

  @IsNotEmpty()
  @IsEnum(EField)
  field: EField;
}

export class ValidateMetaValueDto extends MetadataValue {
  @ValidateIf((o) => !!!o.metadata)
  @IsNotEmpty()
  @IsEnum(EEntityMetadata)
  entity?: EEntityMetadata;
}

export type MetadataReturn = { data: Metadata };

export interface MetadataControllerMethods {
  getMetadata(dto: GetMetadataDto, meta: Meta): Promise<MetadataReturn>;
  isValid(dto: IsValidDto, meta: Meta): Promise<{ data: boolean }>;
  validateMetaValue(dto: ValidateMetaValueDto, meta: Meta): Promise<void>;
}

export interface MetadataServiceMethods extends MetadataControllerMethods {}
