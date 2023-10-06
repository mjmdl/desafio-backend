import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_CONFIG: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
};
