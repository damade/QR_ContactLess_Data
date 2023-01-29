import { Module } from '@nestjs/common';
import { MongoDbService } from './service/mongoDB.providers';

@Module({
    providers: [MongoDbService],
    exports: [MongoDbService]
})
export class DatabaseModule {}
