import { EEntityMetadata, EField } from '@common/utils';
import { FindDto, MetadataValue } from '@common/dto';
import { IsEnum, IsMongoId, IsNotEmpty, ValidateIf } from 'class-validator';
import { Metadata } from '@shared/metadata/metadata.schema';

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

export interface MetadataServiceMethods {
  getMetadata(dto: GetMetadataDto): Promise<MetadataReturn>;
  isValid(dto: IsValidDto): Promise<{ data: boolean }>;
  validateMetaValue(dto: ValidateMetaValueDto): Promise<void>;
}
