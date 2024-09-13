import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIP, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { EApp } from '@common/utils/enum';
import { UserProfile } from '@common/dto/entity.dto';
import AppProp from '@common/decorator/app_prop.decorator';
import BaseSchema from '@common/core/base.schema';

export class RequestLog {
   @IsNotEmpty()
   @IsString()
   service: string;

   @IsNotEmpty()
   @IsString()
   auxiliaryService: string;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   payload?: any;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   response?: any;
}

@Schema()
export default class Audit extends BaseSchema {
   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: RequestLog })
   logTrail: RequestLog[];

   @AppProp({ type: Boolean })
   crossAppRequest: boolean;

   @ValidateIf((o) => !!o.crossAppRequest)
   @Prop({ type: String, enum: EApp })
   requestedFrom?: EApp;

   @AppProp({ type: String }, { swagger: { example: '102.205.88.126' } })
   @IsIP()
   submittedIP: string;

   @AppProp({ type: String })
   sessionId: string;

   @AppProp({ type: SchemaTypes.String })
   userAgent: string;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: UserProfile })
   user?: UserProfile;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
