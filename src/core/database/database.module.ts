import { Module } from '@nestjs/common';
import { MongoDbService } from './service/mongoDB.providers';
import { PrismaService } from './service/PrismaService';

@Module({
    providers: [PrismaService, MongoDbService],
    exports: [PrismaService, MongoDbService]
})
export class DatabaseModule {}
