import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { SupportPrismaService } from './service/support.prisma.service';
import { UtilsModule } from 'src/core/utils/utils.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [DatabaseModule, UtilsModule, LoggerModule],
  providers: [SupportService, SupportPrismaService],
  controllers: [SupportController]
})
export class SupportModule {}
