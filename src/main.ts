import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE_CONFIG } from './configs/validation-pipe.config';
import { useContainer } from 'class-validator';
import './commons/is-cpf.validator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do class-validator
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_CONFIG));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(Number(process.env.APP_PORT));
}
bootstrap();
