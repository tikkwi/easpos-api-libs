import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TmpController } from './tmp.controller';
import { TmpService } from './tmp.service';
import { getRepositoryProvider } from '@common/utils/misc';
import { AppConfig, AppConfigSchema } from '@app/app_config/app_config.schema';

@Module({
   imports: [MongooseModule.forFeature([{ name: AppConfig.name, schema: AppConfigSchema }])],
   controllers: [TmpController],
   providers: [getRepositoryProvider({ name: AppConfig.name }), TmpService],
})
export class TmpModule {}
