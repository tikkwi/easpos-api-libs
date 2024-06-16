import { AUDIT, MAIL } from '@app/constant';
import { MongooseConfigModule } from '@app/core';
import { getGrpcClient } from '@app/helper';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

const [client, services] = getGrpcClient([AUDIT, MAIL]);
@Global()
@Module({
  imports: [ConfigModule, ClientsModule.register(client)],
  providers: [...services],
})
export class SharedModule {}
