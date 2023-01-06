import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/core/logger/logger.module';
import { TransactionService } from './transaction.service';

@Module({
  imports: [LoggerModule],
  providers: [TransactionService],
  exports:[TransactionService],
  //controllers: [BankController]
})
export class TransactionModule {}
