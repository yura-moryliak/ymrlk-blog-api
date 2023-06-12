import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import * as process from 'process';

import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ENV_CONFIGS } from './configs/configuration';

const PORT = 3000 || process.env;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configServiceRef = app.select(AppModule).get(ConfigService);

  app.setGlobalPrefix(configServiceRef.get(ENV_CONFIGS.GLOBAL_API));

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: (requestOrigin, callback) => {

      const whiteList: string[] = [
        configServiceRef.get(ENV_CONFIGS.CORS_ORIGIN),
        configServiceRef.get(ENV_CONFIGS.DEV_SSR_CORS),
      ];

      if (!requestOrigin || whiteList.indexOf(requestOrigin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  await app.listen(PORT as number);
}
bootstrap()
  .then()
  .catch((error) => console.log(error));
