import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { ReferralModule } from '../referral/referral.module';
import { LoanRepaymentController } from './loanrequest.controller';
import { LoanRepaymentByTransferService } from './provider/repaymentbytransfer.service';
import { LoanTransferRepaymentPrismaService } from './service/loantransferrepayment.prisma.service';

@Module({
    imports: [DatabaseModule, LoggerModule, ReferralModule, UtilsModule],
    providers: [LoanRepaymentByTransferService, LoanTransferRepaymentPrismaService],
    controllers: [LoanRepaymentController]
})
export class LoanrepaymentModule {}
