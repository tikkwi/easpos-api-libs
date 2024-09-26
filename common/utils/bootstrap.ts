import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import helmet from 'helmet';
import { RedisClientType } from 'redis';
import { APP, COOKIE_SECRET, REDIS_CLIENT } from '@common/constant';

export default async function appBootstrap(
   module: any,
   port: number,
   ms?: { packages: string[]; module: any },
) {
   const app = await NestFactory.create<NestExpressApplication>(module);
   const config = app.get<ConfigService>(ConfigService);
   const currentApp = config.get<string>(APP);
   const documentConfig = new DocumentBuilder().setTitle(currentApp).setVersion('1.0').build();

   // app.setGlobalPrefix(`${currentApp}_api`);
   const document = SwaggerModule.createDocument(app, documentConfig);
   SwaggerModule.setup('swagger', app, document);
   const redisClient = app.get<RedisClientType>(REDIS_CLIENT);
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
         saveUninitialized: false,
         cookie: {
            secure: process.env.NODE_ENV === 'prod',
            httpOnly: true,
            maxAge: 3600000,
         },
      }),
   );
   app.use(helmet());

   await app.listen(port);

   if (ms) {
      const [pkg, pth] = ms.packages.reduce(
         (acc, cur) => {
            acc[0].push(`${cur}_PACKAGE`);
            acc[1].push(`dist/common/src/proto/${cur.toLowerCase()}.proto`);
            return acc;
         },
         [[], []],
      );
      const grpcApp = await NestFactory.createMicroservice(ms.module, {
         transport: Transport.GRPC,
         options: {
            package: pkg,
            protoPath: pth,
            url: `localhost:${port + 1}`,
         },
      });
      await grpcApp.listen();
   }
}
