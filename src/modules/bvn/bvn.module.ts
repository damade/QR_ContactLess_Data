import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { BvnDatabaseService } from './services/bvn.db.service';
import { BvnController } from './bvn.controller';
import { BvnService } from './bvn.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[DatabaseModule, UtilsModule, LoggerModule, UsersModule],
  providers: [BvnService, BvnDatabaseService],
  exports: [BvnService],
  controllers: [BvnController]
})
export class BvnModule {}
