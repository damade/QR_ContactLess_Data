import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer"
import * as dotenv from 'dotenv';
import { AppLogger } from "src/core/logger/logger";
dotenv.config();

@Injectable()
export class EmailService {

    constructor(private readonly appLogger: AppLogger) { }

   private transporter = nodemailer.createTransport({
        host: 'mail.kadickintegrated.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    
   private message = (emailAddr : string, otp: string) => {
        return {
            from: '"Kadick Dev" <no_reply@kadickintegrated.com>',
            to: emailAddr,
            subject: "K-KREDIT OTP",
            text: `Your K-Kredit One Time Password is ${otp}. This code expires in 5 minutes.\n\n Support: 08000523425,\n Contact Us: customercare@kadickintegrated.com`,
        }
    }
    
    async sendOtp(emailAddr: string, otp: string) {
        try{
            const sender =  await this.transporter.sendMail(this.message(emailAddr, otp));
            this.appLogger.log("Mail sent")
        
            return sender;
        }
        catch (e){
            this.appLogger.log(e);
            throw new Error(e.message);
        }
    
    }
}