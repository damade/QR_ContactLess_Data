import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { UsersPrismaService } from './services/users.prisma.service';
import { UserController } from './user.controller';
import { UsersFinanceService } from './users.finance.service';
import { UsersService } from './users.service';

@Module({
  imports:[DatabaseModule, UtilsModule, EligibilityModule, LoggerModule],
  providers: [UsersService, UsersPrismaService, UsersFinanceService],
  exports: [UsersService, UsersFinanceService],
  controllers: [UserController]
})
export class UsersModule {}
