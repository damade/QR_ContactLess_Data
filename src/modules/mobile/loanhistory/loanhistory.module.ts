import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { UsersModule } from '../users/users.module';
import { LoanHistoryController } from './loanhistory.controller';
import { LoanHistoryService } from './loanhistory.service';
import { LoanHistoryPrismaService } from './service/loanhistory.prisma.service';

@Module({
    imports:[DatabaseModule, UsersModule, EligibilityModule, LoggerModule],
  providers: [LoanHistoryService, LoanHistoryPrismaService],
  controllers: [LoanHistoryController],
  exports: [LoanHistoryService]
})
export class LoanhistoryModule {}
