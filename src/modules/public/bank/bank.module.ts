import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [BankService],
  exports:[BankService],
  controllers: [BankController]
})
export class BankModule{}

