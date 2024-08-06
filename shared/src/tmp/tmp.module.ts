import { AppConfig, AppConfigSchema } from '@common/schema/app_config.schema';
import { getRepositoryProvider } from '@common/utils/misc';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TmpController } from './tmp.controller';
import { TmpService } from './tmp.service';

@Module({
   imports: [MongooseModule.forFeature([{ name: AppConfig.name, schema: AppConfigSchema }])],
   controllers: [TmpController],
   providers: [getRepositoryProvider({ name: AppConfig.name }), TmpService],
})
export class TmpModule {}
