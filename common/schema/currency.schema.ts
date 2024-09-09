import { OmitType } from '@nestjs/swagger';
import { Unit } from '@common/schema/unit.schema';

/*
 * NOTE:
 * use category in case needed because difference between unit is unit is stable and unit is volatile
 * so it we convert everywhere and store only base will lead to inaccurate data..
 * */
export class Currency extends OmitType(Unit, ['category']) {}
