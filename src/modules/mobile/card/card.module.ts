import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardDetailsPrismaService } from './service/card.details.prisma.service';
import { AddCardDetailsPrismaService } from './service/add.card.details.prisma.service';
import { EligibilityModule } from '../eligibility/eligibility.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { TransactionModule } from 'src/modules/public/transaction/transaction.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [EligibilityModule, DatabaseModule, LoggerModule, TransactionModule, UsersModule],
  providers: [AddCardDetailsPrismaService,CardDetailsPrismaService, CardService],
  exports: [CardService],
  controllers: [CardController]
})
export class CardModule {}
