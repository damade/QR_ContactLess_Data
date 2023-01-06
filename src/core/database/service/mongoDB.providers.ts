import { Injectable, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose'
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class MongoDbService implements OnModuleInit {

    async onModuleInit() {
      var uri = process.env.MONGO_URI   
        await mongoose.connect(uri, {
        }).then(()=>{
            console.log('Mongo DB connection successful');
        }).catch((err)=>{
            console.error(err.message);
            process.exit(1);
        });
    }

    async onModuleDestroy() {
        mongoose.disconnect()
        await mongoose.connection.close();
    }
}

