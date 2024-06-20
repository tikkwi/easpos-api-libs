import { Module } from '@nestjs/common';
import { ExceedLimitController } from './exceed_limit.controller';
import { ExceedLimitService } from './exceed_limit.service';

@Module({
  controllers: [ExceedLimitController],
  providers: [ExceedLimitService],
  exports: [ExceedLimitService],
})
export class ExceedLimitModule {}
