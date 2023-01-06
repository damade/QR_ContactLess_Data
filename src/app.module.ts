import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UtilsModule } from './core/utils/utils.module';
import { UsersModule } from './modules/mobile/users/users.module';
import { AuthModule } from './modules/mobile/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/HttpExceptionFilter';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { TimeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { JwtAuthGuard } from './core/guards/jwt.auth.guard';
import { ApiKeyMiddleware } from './core/middlewares/apikey.middleware';
import { BankDetailsModule } from './modules/mobile/bank/bank.module';
import { BusinessModule } from './modules/mobile/business/business.module';
import { CardModule } from './modules/mobile/card/card.module';
import { EmploymentModule } from './modules/mobile/employment/employment.module';
import { GuarantorModule } from './modules/mobile/guarantor/guarantor.module';
import { ReferralModule } from './modules/mobile/referral/referral.module';
import { EligibilityModule } from './modules/mobile/eligibility/eligibility.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './core/logger/logger.module';
import { TaskHandlerModule } from './core/taskhandler/task.handler.module';
import { HttpStreamMiddleware } from './core/logger/morgan.middleware';
import { SupportModule } from './modules/mobile/support/support.module';
import { LoaninfoModule } from './modules/mobile/loaninfo/loaninfo.module';
import { LoanhistoryModule } from './modules/mobile/loanhistory/loanhistory.module';
import { LoanrequestModule } from './modules/mobile/loanrequest/loanrequest.module';
import { LoanrepaymentModule } from './modules/mobile/loanrepayment/loanrepayment.module';
import { PaymentModule } from './modules/mobile/payment/payment.module';
import { ApiKeyGenerationService } from './core/utils/service/api.key.gen.service';
import { AppLogger } from './core/logger/logger';
import { BankModule } from './modules/public/bank/bank.module';
import { SupportWebModule } from './modules/public/support/support.module';
import { LoaninfoWebModule } from './modules/public/loaninfo/loaninfo.module';
import { TransactionModule } from './modules/public/transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MulterModule.register({
    storage: memoryStorage(), // use memory storage for having the buffer
  }),
    ScheduleModule.forRoot(),//For CronJobs,
    DatabaseModule, UtilsModule, LoggerModule, TaskHandlerModule,
    UsersModule, AuthModule, BankModule, BankDetailsModule,
    BusinessModule, CardModule, EmploymentModule, GuarantorModule, 
    ReferralModule, EligibilityModule, SupportModule, SupportWebModule,
    LoaninfoModule, LoaninfoWebModule, LoanhistoryModule, LoanrequestModule,
    LoanrepaymentModule, PaymentModule, TransactionModule],
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
      this.apiKeyGenService.startApiKeyCron()
  }
}