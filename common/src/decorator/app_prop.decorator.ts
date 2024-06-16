import { regex } from '@app/helper';
import { Prop, PropOptions } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

type Options = {
  userName?: boolean;
  validateString?: boolean;
  prop?: boolean;
  swagger?: Omit<ApiPropertyOptions, 'type'>;
};

export function AppProp(
  propOptions?: PropOptions,
  options?: Options | (Options & { nested: any }),
) {
  return function (target: any, key: string) {
    const { validateString = true, prop = true, userName = false, swagger } = options ?? {};

    const pOpt: any = {
      immutable: true,
      ...((propOptions as any) ?? {}),
      required: (propOptions as any)?.required ?? true,
    };
    if (prop) Prop(pOpt)(target, key);
    ApiProperty({
      type: pOpt.type,
      enum: pOpt.enum as any,
      example: pOpt.enum ? Object.keys(pOpt.enum)[0] : userName ? 'easposUser11' : undefined,
      description: userName ? 'Unique username with contain letters & numbers only' : undefined,
      ...swagger,
    })(target, key);

    if (
      pOpt.type.name === 'SchemaMixed' ||
      (Array.isArray(pOpt.type) && pOpt.type[0].type.name === 'SchemaMixed')
    )
      ValidateNested({ each: Array.isArray(pOpt.type) ? true : undefined })(target, key);
    if (pOpt.required) IsNotEmpty()(target, key);
    if (pOpt.enum) IsEnum(pOpt.enum as any)(target, key);

    switch ((pOpt.type as any).name) {
      case 'String':
        if (validateString && !pOpt.enum) IsString()(target, key);
        break;

      case 'Number':
        IsNumber()(target, key);
        break;

      case 'Boolean':
        IsBoolean()(target, key);
        break;

      case 'Date':
        IsDateString()(target, key);
        break;

      case 'SchemaObjectId':
        IsMongoId()(target, key);
        break;

      default:
        break;
    }

    if (userName) Matches(regex.userName)(target, key);
  };
}
