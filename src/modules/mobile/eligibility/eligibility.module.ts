import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { EligibilityPrismaService } from './eligibility.prisma.service';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [DatabaseModule],
  providers: [EligibilityService, EligibilityPrismaService],
  exports: [EligibilityService],
})
export class EligibilityModule {

}
