import BaseSchema from '@common/core/base/base.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export default class Mail extends BaseSchema {}

export const MailSchema = SchemaFactory.createForClass(Mail);
