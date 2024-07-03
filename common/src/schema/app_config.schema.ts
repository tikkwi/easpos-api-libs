import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema()
export class AppConfig extends BaseSchema {}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
