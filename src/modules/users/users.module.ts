import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { LoggerModule } from 'src/core/logger/logger.module';
import { UtilsModule } from 'src/core/utils/utils.module';
import { UsersDatabaseService } from './services/users.db.service';
import { UserController } from './user.controller';
import { UsersService } from './users.service';

@Module({
  imports:[DatabaseModule, UtilsModule, LoggerModule],
  providers: [UsersService, UsersDatabaseService],
  exports: [UsersService],
  controllers: [UserController]
})
export class UsersModule {}
