import { Module } from '@nestjs/common';
import { LoaninfoService } from './loaninfo.service';
import { LoaninfoController } from './loaninfo.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { LoaninfoWebModule } from 'src/modules/public/loaninfo/loaninfo.module';

@Module({
  imports: [DatabaseModule, EligibilityModule, LoggerModule, LoaninfoWebModule ],
  providers: [LoaninfoService],
  exports: [LoaninfoService],
  controllers: [LoaninfoController]
})
export class LoaninfoModule {}
