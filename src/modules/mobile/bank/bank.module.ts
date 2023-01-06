import { Module } from '@nestjs/common';
import { BankDetailsService } from './bank.details.service';
import { BankDetailsController } from './bank.controller';
import { BankModule } from 'src/modules/public/bank/bank.module';
import { BankDetailsPrismaService } from './service/bank.details.prisma.service';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [BankModule, EligibilityModule, DatabaseModule, LoggerModule, BankModule],
  providers: [BankDetailsService, BankDetailsPrismaService],
  exports: [BankDetailsService],
  controllers: [BankDetailsController]
})
export class BankDetailsModule {}
