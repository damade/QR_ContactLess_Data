import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerModule } from '../logger/logger.module';
import { TaskHandlerService } from './taskhandler';


@Module({
  imports: [LoggerModule],
  providers: [TaskHandlerService],
  exports: [TaskHandlerService],
})
export class TaskHandlerModule {}