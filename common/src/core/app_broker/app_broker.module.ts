import { Module } from '@nestjs/common';
import { AppBrokerService } from './app_broker.service';

@Module({ providers: [AppBrokerService], exports: [AppBrokerService] })
export class AppBrokerModule {}
