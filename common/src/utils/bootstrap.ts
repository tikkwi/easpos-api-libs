import { APP, COOKIE_SECRET, REDIS_CLIENT } from '@common/constant';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import { RedisClientType } from 'redis';

export async function appBootstrap(
  module: any,
  port: number,
  packages?: string[],
) {
  const app = await NestFactory.create<NestExpressApplication>(module);
  const config = app.get<ConfigService>(ConfigService);
  const currentApp = config.get<string>(APP);
  const documentConfig = new DocumentBuilder()
    .setTitle(currentApp)
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix(`${currentApp}_api`);
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);
  const redisClient = await app.get<RedisClientType>(REDIS_CLIENT);
  const store = new RedisStore({
    client: redisClient,
    prefix: 'session-store:',
  });
  app.set('trust proxy', 1);
  // if (process.env.NODE_ENV === 'prod') app.set('trust proxy', 1);
  app.use(
    session.default({
      store,
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
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);

  if (packages) {
    const [pkg, name] = packages.reduce(
      (acc, cur) => {
        acc[0].push(cur);
        acc[1].push(cur.toLowerCase());
        return acc;
      },
      [[], []],
    );
    const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
      module,
      {
        transport: Transport.GRPC,
        options: {
          package: pkg,
          protoPath: name.map((e) =>
            join(process.cwd(), `libs/common/proto/${e}.proto`),
          ),
        },
      },
    );
    grpcApp.listen();
  }
}
