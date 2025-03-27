import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true, 
    methods: ['POST', 'GET', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization']       
  });  

  await app.listen(8001);
}
bootstrap();
