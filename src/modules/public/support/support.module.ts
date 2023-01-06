import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { UtilsModule } from 'src/core/utils/utils.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { SupportPrismaService } from './service/support.prisma.service';

@Module({
  imports: [DatabaseModule, UtilsModule, LoggerModule],
  providers: [SupportService, SupportPrismaService],
  controllers: [SupportController]
})
export class SupportWebModule {}
