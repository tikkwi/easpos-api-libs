import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { EAuthCredential } from '@common/utils/enum';
import BaseSchema from '../core/base.schema';
import AppProp from '../decorator/app_prop.decorator';

class AllowedService {
   @IsString()
   @IsNotEmpty()
   service: string;

   @IsOptional()
   @IsString()
   @IsNotEmpty()
   paths?: string[];
}

@Schema()
export default class AuthCredential extends BaseSchema {
   @AppProp({ type: String, enum: EAuthCredential })
   type: EAuthCredential;

   @AppProp({ type: String }, { userName: true })
   userName: string;

   @AppProp({ type: String, set: (pas) => hashSync(pas, 16) })
   password: string;

   @ValidateIf((o) => !!o.type.includes('rpc'))
   @AppProp({ type: [{ type: String }] })
   allowedPeers: string[];

   @ValidateIf((o) => !!o.type.includes('rpc'))
   @AppProp({ type: [{ type: SchemaTypes.Mixed }] })
   @Type(() => AllowedService)
   authServices: AllowedService[];

   @ValidateIf((o) => !!!o.type.includes('rpc'))
   @AppProp({ type: [{ type: String }] })
   @IsUrl()
   authPaths: string[];
}

export const AuthCredentialSchema = SchemaFactory.createForClass(AuthCredential);
