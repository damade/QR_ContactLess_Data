import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { BusinessProfilePrismaService } from './services/business.profile.prisma.service';
import { EligibilityModule } from '../eligibility/eligibility.module';

@Module({
  imports: [DatabaseModule, UtilsModule, EligibilityModule, LoggerModule],
  providers: [BusinessService, BusinessProfilePrismaService],
  controllers: [BusinessController]
})
export class BusinessModule {}
