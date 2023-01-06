import { Module } from '@nestjs/common';
import { EmploymentService } from './employment.service';
import { EmploymentController } from './employment.controller';
import { EmploymentPrismaService } from './services/employment.prisma.service';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [EligibilityModule, DatabaseModule, LoggerModule],
  providers: [EmploymentService, EmploymentPrismaService],
  exports: [EmploymentService],
  controllers: [EmploymentController]
})
export class EmploymentModule {}
