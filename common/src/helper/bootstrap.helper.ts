import { APP, COOKIE_SECRET, REDIS_CLIENT } from '@app/constant';
import { AppExceptionFilter } from '@app/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import * as Redis from 'redis';

export async function appBootstrap(module: any, port: number, packages?: string[]) {
  const app = await NestFactory.create(module);
  const config = app.get<ConfigService>(ConfigService);
  const documentConfig = new DocumentBuilder()
    .setTitle(config.get<string>(APP))
    .setVersion('1.0')
    .build();

  dotenv.config({ path: join(__dirname, '../../.env') });

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);
  // const redisClient = await app.get<Redis.RedisClientType>(REDIS_CLIENT);
  // const store = new RedisStore({
  //   client: redisClient,
  //   prefix: 'session-store:',
  // });
  // if (process.env.NODE_ENV === 'prod') app.use('trust proxy', 1);
  app.use(
    session({
      // store,
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'prod',
        httpOnly: true,
        maxAge: 3600000,
      },
    }),
  );
  app.use(helmet);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(port);

  //microservice
  if (packages) {
    const [pkg, name] = packages.reduce(
      (acc, cur) => {
        acc[0].push(cur);
        acc[1].push(cur.toLowerCase().replace(/(_package)$/, ''));
        return acc;
      },
      [[], []],
    );
    const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(module, {
      transport: Transport.GRPC,
      options: {
        package: pkg,
        protoPath: name.map((e) => join(__dirname, `../${e}.proto`)),
      },
    });
    grpcApp.listen();
  }
}
