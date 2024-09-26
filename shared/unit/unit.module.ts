import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Unit, { UnitSchema } from './unit.schema';
import UnitController from './unit.controller';
import UnitService from './unit.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }])],
   controllers: [UnitController],
   providers: [UnitService, getRepositoryProvider({ name: Unit.name })],
   exports: [UnitService],
})
export class UnitModule {}
