import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { AdminUsersDatabaseService } from './services/admin.users.db.service';
import { AdminUserController } from './admin.user.controller';
import { AdminUsersService } from './admin.users.service';
import { BankAccountModule } from '../bankaccount/bank.account.module';
import { BvnModule } from '../bvn/bvn.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[DatabaseModule, UtilsModule, LoggerModule, BankAccountModule, BvnModule, UsersModule],
  providers: [AdminUsersService, AdminUsersDatabaseService],
  exports: [AdminUsersService],
  controllers: [AdminUserController]
})
export class AdminUsersModule {}
