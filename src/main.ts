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
    origin: configServiceRef.get(ENV_CONFIGS.CORS_ORIGIN),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  await app.listen(PORT as number);
}
bootstrap()
  .then()
  .catch((error) => console.log(error));
