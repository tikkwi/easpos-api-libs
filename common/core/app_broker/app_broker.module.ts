import { Global, Module } from '@nestjs/common';
import AppBrokerService from './app_broker.service';

@Global()
@Module({ providers: [AppBrokerService], exports: [AppBrokerService] })
export default class AppBrokerModule {}
