import { Module } from '@nestjs/common';
import { ExceedLimitController } from './exceed_limit.controller';
import { ExceedLimitService } from './exceed_limit.service';
import { ExceedLimit, ExceedLimitSchema } from './exceed_limit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
  imports: [MongooseModule.forFeature([{ name: ExceedLimit.name, schema: ExceedLimitSchema }])],
  controllers: [ExceedLimitController],
  providers: [ExceedLimitService, getRepositoryProvider(ExceedLimit.name)],
  exports: [ExceedLimitService],
})
export class ExceedLimitModule {}
