import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UtilsModule } from './core/utils/utils.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/HttpExceptionFilter';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { JwtAuthGuard } from './core/guards/jwt.auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './core/logger/logger.module';
import { TaskHandlerModule } from './core/taskhandler/task.handler.module';
import { HttpStreamMiddleware } from './core/logger/morgan.middleware';
import { ApiKeyGenerationService } from './core/utils/service/api.key.gen.service';
import { AppLogger } from './core/logger/logger';
import { BvnModule } from './modules/bvn/bvn.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminUsersModule } from './modules/admin_users/admin.users.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MulterModule.register({
    storage: memoryStorage(), // use memory storage for having the buffer
  }),
    ScheduleModule.forRoot(),//For CronJobs,
    DatabaseModule, UtilsModule, LoggerModule, TaskHandlerModule, BvnModule, AdminUsersModule,
    UsersModule, AuthModule, BvnModule ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },  {
      provide: APP_PIPE,
      useClass: ValidateInputPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, 
    }, ],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpStreamMiddleware)
      .exclude({ path:'/api/v1/customer/auth',method: RequestMethod.ALL})
      .forRoutes();
      //ApiKeyMiddleware,    
  }
  constructor(
    private readonly apiKeyGenService: ApiKeyGenerationService,
    private readonly appLogger: AppLogger
  ){
      //this.apiKeyGenService.startApiKeyCron()
  }
}