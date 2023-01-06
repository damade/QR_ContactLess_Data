import { Module } from '@nestjs/common';
import { GuarantorService } from './guarantor.service';
import { GuarantorController } from './guarantor.controller';
import { GuarantorPrismaService } from './service/guarantor.prisma.service';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [EligibilityModule, DatabaseModule, LoggerModule],
  providers: [GuarantorService, GuarantorPrismaService],
  controllers: [GuarantorController]
})
export class GuarantorModule {}
