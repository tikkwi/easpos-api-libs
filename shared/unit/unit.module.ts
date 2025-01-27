import { Global, Module } from '@nestjs/common';
import { UnitSchema } from './unit.schema';
import UnitController from './unit.controller';
import UnitService from './unit.service';
import { SCHEMA } from '@common/constant';

@Global()
@Module({
   controllers: [UnitController],
   providers: [UnitService, { provide: SCHEMA, useValue: UnitSchema }],
   exports: [UnitService],
})
export class UnitModule {}
