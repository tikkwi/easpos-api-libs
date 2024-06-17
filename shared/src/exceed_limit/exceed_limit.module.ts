import { EXCEED_LIMIT } from '@common/constant';
//import { getRepositoryProviders } from '@common/helper';
import { Module } from '@nestjs/common';
import { ExceedLimitController } from './exceed_limit.controller';
import { ExceedLimitService } from './exceed_limit.service';

@Module({
  controllers: [ExceedLimitController],
  providers: [
    ExceedLimitService,
    // ...getRepositoryProviders[EXCEED_LIMIT]
  ],
})
export class ExceedLimitModule {}
