import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { UsersModule } from '../users/users.module';
import { BankAccountController } from './bank.account.controller';
import { BankAccountService } from './bank.account.service';
import { BankAccountDatabaseService } from './services/bank.account.db.service';

@Module({
  imports:[DatabaseModule, UtilsModule, LoggerModule, UsersModule],
  providers: [BankAccountService, BankAccountDatabaseService],
  exports: [BankAccountService],
  controllers: [BankAccountController]
})
export class BankAccountModule {}
