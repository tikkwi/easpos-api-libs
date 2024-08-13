import { Global, Module } from '@nestjs/common';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';

@Global()
@Module({ providers: [AppBrokerService], exports: [AppBrokerService] })
export class AppBrokerModule {}
