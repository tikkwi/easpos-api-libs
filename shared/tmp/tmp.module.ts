import { AppConfig, AppConfigSchema } from '../../../../src/app_config/app_config.schema';
import { getRepositoryProvider } from '@utils/misc';
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
