import { ADM_MRO_BSC_AUH, ADM_MRO_PWD, ADM_MRO_USR } from '@common/constant';
import { CoreModule } from '@common/core/module/core.module';
import { base64 } from '@common/utils/misc';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
   imports: [CoreModule],
   providers: [
      {
         provide: ADM_MRO_BSC_AUH,
         useFactory: (config: ConfigService) =>
            base64(`${config.get(ADM_MRO_USR)}:${config.get(ADM_MRO_PWD)}`),
         inject: [ConfigService],
      },
   ],
})
export class GrpcModule {}
