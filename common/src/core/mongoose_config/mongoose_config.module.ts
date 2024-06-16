import { Global, Module } from '@nestjs/common';
import { MongooseConfigService } from './mongoose_config.service';

@Global()
@Module({
  imports: [],
  providers: [MongooseConfigService],
  exports: [MongooseConfigService],
})
export class MongooseConfigModule {}
