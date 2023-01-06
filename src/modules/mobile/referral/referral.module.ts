import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UsersModule } from '../users/users.module';
import { ReferralPrismaService } from './service/referral.prisma.service';

@Module({
  imports:[DatabaseModule, UsersModule, EligibilityModule, LoggerModule],
  providers: [ReferralService, ReferralPrismaService],
  controllers: [ReferralController],
  exports: [ReferralService]
})
export class ReferralModule {}
