import { OmitType } from '@nestjs/swagger';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import Unit from '../unit/unit.schema';

@Schema()
export default class Currency extends OmitType(Unit, ['category']) {}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
