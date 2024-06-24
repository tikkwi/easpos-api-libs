import { AppProp } from '@common/decorator/app_prop.decorator';
import { EAuthCredential } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { BaseSchema } from './base.schema';
import { IsUrl } from 'class-validator';

@Schema()
export class AuthCredential extends BaseSchema {
  @AppProp({ type: String, enum: EAuthCredential })
  type: EAuthCredential;

  @AppProp({ type: String }, { userName: true })
  userName: string;

  @AppProp({ type: String, set: (pas) => hashSync(pas, 16) })
  password: string;

  @AppProp({ type: [{ type: String }] })
  @IsUrl()
  authPaths: string[];
}

export const AuthCredentialSchema = SchemaFactory.createForClass(AuthCredential);
