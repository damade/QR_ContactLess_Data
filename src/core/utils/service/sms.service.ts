import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { getErrorMessage } from "../helpers/error.helper";
import * as fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { AppLogger } from "src/core/logger/logger";
dotenv.config();


@Injectable()
export class SmsService {

    constructor(private readonly appLogger: AppLogger) { }
    /**
 * Send OTP
 * @param {String} recipient
 * @returns {object}
 */

     async sendOtp(phoneNumber: string, otp: string) {
        this.appLogger.log("About to send SmS");
        try{
            var termiiPhoneNumber = phoneNumber;
            if(!phoneNumber.startsWith("234")){
              termiiPhoneNumber = "234" + phoneNumber.slice(1);
            }
            var data = {
                "to": termiiPhoneNumber,
                "from": process.env.TERMII_SENDER_ID,
                "sms": `Your KKREDIT One Time Password is ${otp}. This code expires in 5 minutes.`,
                "type": "plain",
                "channel": "generic",
                "api_key": process.env.TERMII_API_KEY,
        };
        
            fetch('https://api.ng.termii.com/api/sms/send', {
                method: 'post',
                body:    JSON.stringify(data),
                headers: { 'Content-Type': 'application/json; charset=utf-8'}})
            .catch(err => {
                this.appLogger.error(err);
                throw new HttpException(getErrorMessage(err), err.status);
            })
            .then(resp => {return resp.json()})
            } catch (error) {
              this.appLogger.log(error)
              throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        
        }
        
    
}