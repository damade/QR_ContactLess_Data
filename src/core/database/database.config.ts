import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
    development: {
        uriDatabase: process.env.MONGO_URI,
    },
    test: {
        uriDatabase: process.env.MONGO_URI,
    },
    production: {
        uriDatabase: process.env.MONGO_URI,
    },
};