import { Module } from '@nestjs/common';
import { LoaninfoWebService } from './loaninfo.service';
import { LoaninfoController } from './loaninfo.controller';
import { LoggerModule } from 'src/core/logger/logger.module';
import { TaskHandlerModule } from 'src/core/taskhandler/task.handler.module';
import { LoanRateService } from './loanrate.service';
import { LoanInfoRateController } from './loanrate.controller';
import { EligibilityModule } from 'src/modules/mobile/eligibility/eligibility.module';

@Module({
  imports: [LoggerModule, TaskHandlerModule, EligibilityModule],
  providers: [LoaninfoWebService, LoanRateService],
  controllers: [LoaninfoController,LoanInfoRateController],
  exports: [LoaninfoWebService, LoanRateService]
})
export class LoaninfoWebModule {}
