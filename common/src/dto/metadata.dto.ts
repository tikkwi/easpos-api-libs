import { FindDto } from '@common/dto/core.dto';
import { EEntityMetadata, EField } from '@common/utils/enum';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Metadata } from '../schema/metadata.schema';
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

export class ValidateMetaValueDto {
  @IsOptional()
  @ValidateNested()
  value?: any;

  @IsEnum(EEntityMetadata)
  entity: EEntityMetadata;
}

export type MetadataReturn = { data: Metadata };

export interface MetadataServiceMethods {
  getMetadata(dto: GetMetadataDto): Promise<MetadataReturn>;
  isValid(dto: IsValidDto): Promise<{ data: boolean }>;
  validateMetaValue(dto: ValidateMetaValueDto): Promise<void>;
}
