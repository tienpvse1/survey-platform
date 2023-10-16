/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./environment.d.ts" />
/// <reference path="./types/index.d.ts" />
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import './app/common/Promise';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.SERVER_PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
