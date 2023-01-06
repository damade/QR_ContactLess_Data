import { Module } from '@nestjs/common';
import { AppLogger } from './logger';
import { HttpStreamMiddleware } from './morgan.middleware';


@Module({
  providers: [AppLogger, HttpStreamMiddleware],
  exports: [AppLogger, HttpStreamMiddleware],
})
export class LoggerModule {}