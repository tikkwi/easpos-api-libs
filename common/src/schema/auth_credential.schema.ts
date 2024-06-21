import { EAuthCredential } from '@common/utils/enum';
import { SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { BaseSchema } from './base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';

export class AuthCredential extends BaseSchema {
  @AppProp({ type: String, enum: EAuthCredential })
  type: EAuthCredential;

  @AppProp({ type: String }, { userName: true })
  userName: string;

  @AppProp({ type: String, set: async (pas) => await hash(pas, 16) })
  password: string;
}

export const AuthCredentialSchema = SchemaFactory.createForClass(AuthCredential);
