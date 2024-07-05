import { AppProp } from '@common/decorator/app_prop.decorator';
import { User } from '@common/dto/entity.dto';
import { BaseSchema } from '@common/schema/base.schema';
import { EApp } from '@common/utils/enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsBoolean, IsIP, IsNotEmpty, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { SchemaTypes } from 'mongoose';

export class RequestLog {
  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  @IsString()
  auxillaryService: string;

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  payload?: any;

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  response?: any;
}

@Schema()
export class Audit extends BaseSchema {
  @AppProp({ type: SchemaTypes.Mixed })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RequestLog)
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

  @AppProp({ type: SchemaTypes.Mixed, required: false })
  @Type(() => User)
  user?: User;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
