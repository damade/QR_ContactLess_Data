import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { LoaninfoWebModule } from 'src/modules/public/loaninfo/loaninfo.module';
import { BankDetailsModule } from '../bank/bank.module';
import { CardModule } from '../card/card.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { EmploymentModule } from '../employment/employment.module';
import { LoaninfoController } from '../loaninfo/loaninfo.controller';
import { LoaninfoModule } from '../loaninfo/loaninfo.module';
import { UsersModule } from '../users/users.module';
import { LoanApplicationService } from './providers/loanapplication.service';
import { PersonalLoanPreApplicationService } from './providers/personalLoanpreapplication.service';
import { LoanrequestController } from './loanrequest.controller';
import { LoanInfoPrismaService } from './service/loaninfo.prisma.service';
import { ReferralModule } from '../referral/referral.module';
import { UtilsModule } from 'src/core/utils/utils.module';

@Module({
    imports: [DatabaseModule, EligibilityModule, LoggerModule, LoaninfoModule,
        CardModule, BankDetailsModule, LoaninfoWebModule, UsersModule,
        EmploymentModule, ReferralModule, UtilsModule],
    providers: [PersonalLoanPreApplicationService, LoanApplicationService, LoanInfoPrismaService],
    controllers: [LoanrequestController]
})
export class LoanrequestModule { }
