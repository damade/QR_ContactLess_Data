import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './core/database/service/PrismaService';
import { HttpExceptionFilter } from './core/exceptions/HttpExceptionFilter';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { AppLogger } from './core/logger/logger';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // global prefix
  app.setGlobalPrefix('api/v1');

  //set logger
  app.useLogger(app.get(AppLogger))

  //Global Error Handler
  app.useGlobalFilters(new HttpExceptionFilter());

  //Global Time-out Interceptor
  app.useGlobalInterceptors(new TimeoutInterceptor())

  // handle all user input validation globally
  app.useGlobalPipes(new ValidateInputPipe());

  //Prisma Add-ons
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  //Start App
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
