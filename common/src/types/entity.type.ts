import { EUser } from '@app/helper';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FieldValue {
  @IsMongoId()
  field: ObjectId;

  //NOTE: require manual validation here
  value: any;
}

export class MetadataValue {
  @IsMongoId()
  metadata?: string;

  @IsNotEmpty()
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
