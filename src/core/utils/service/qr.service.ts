
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
import { IUser } from 'src/modules/users/model/user.entity';
import { AppLogger } from 'src/core/logger/logger';
dotenv.config();

@Injectable()
export class QrService {


    constructor(
        private readonly appLogger: AppLogger
    ) { }

    generateUserQrToScan(user: IUser): string {
        
        const currentTime = new Date();
        const urlToSend = `${process.env.PASSWORD_RESET_URL}
        /fetch-qr-info/${encodeURIComponent(user.uniqueId + '/' + currentTime + '/' + ' ' + user._id + ' ')}`;
            
        this.appLogger.log(urlToSend)
        return urlToSend;
    };

   
}  