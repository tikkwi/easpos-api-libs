import { Global, Module } from '@nestjs/common';
import { MiscService } from '@common/core/misc/misc.service';

@Global()
@Module({ providers: [MiscService], exports: [MiscService] })
export class MiscModule {}
