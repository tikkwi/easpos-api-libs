import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EAuthCredential, EType } from '../../utils/enum';
import BaseSchema from '../../core/base/base.schema';
import AppProp from '../../decorator/app_prop.decorator';
import { IsRecord } from '../../validator';

@Schema()
export default class AuthCredential extends BaseSchema {
   @AppProp({ type: String, enum: EAuthCredential, unique: true })
   type: EAuthCredential;

   @AppProp({ type: String }, { userName: true })
   userName: string;

   @AppProp({ type: String, set: (pas) => hashSync(pas, 16) })
   password: string;

   // @ValidateIf((o) => !!o.type.includes('rpc'))
   // @AppProp({ type: [{ type: String }] })
   // allowedPeers: string[];

   @ValidateIf((o) => !!o.type.includes('rpc'))
   @AppProp(
      { type: SchemaTypes.Mixed },
      {
         validators: [{ func: IsRecord, args: [{ isValueArray: true, value: EType.String }] }],
      },
   )
   authServices: Record<string, Array<string>>;

   // @ValidateIf((o) => !!!o.type.includes('rpc'))
   // @AppProp({ type: [{ type: String }] })
   // @IsUrl()
   // authPaths: string[];
}

export const AuthCredentialSchema = SchemaFactory.createForClass(AuthCredential);
