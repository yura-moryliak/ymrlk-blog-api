import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

import * as process from 'process';

import { AppModule } from './app.module';
import helmet from 'helmet';

const PORT = 3000 || process.env;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:4200' });
  app.use(helmet());

  await app.listen(PORT as number);
}
bootstrap()
  .then()
  .catch((error) => console.log(error));
