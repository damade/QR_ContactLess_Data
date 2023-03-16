import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer"
import * as dotenv from 'dotenv';
import { AppLogger } from "src/core/logger/logger";
dotenv.config();

@Injectable()
export class EmailService {

    constructor(private readonly appLogger: AppLogger) { }

    private transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    private message = (emailAddr: string, otp: string) => {
        return {
            from: '"E2Z Bank" <no_reply@e2zbank.com>',
            to: emailAddr,
            subject: "E2Z OTP",
            text: `Your bank account/bvn registration One Time Password is ${otp}. This code expires in 5 minutes.\n\n Support: 080005558685,\n Contact Us: customercare@e2zbank.com`,
        }
    }

    private sendForgotPasswordMessage = (emailAddr: string, otp: string) => {
        return {
            from: '"E2Z Bank" <no_reply@e2zbank.com>',
            to: emailAddr,
            subject: "E2Z OTP",
            text: `You seem to have forgotten your password, you are on step closer to retrieving it.\nOne Time Password is ${otp}. This code expires in 5 minutes.\n`,
        }
    }

    private adminMessage = (emailAddr: string, otp: string) => {
        return {
            from: '"E2Z Bank" <no_reply@e2zbank.com>',
            to: emailAddr,
            subject: "E2Z Staff Account Registration Otp",
            text: `Your registration One Time Password for EZBank Staff Portal is ${otp}. This code expires in 5 minutes.`,
        }
    }

    private adminLogin = (emailAddr: string, otp: string) => {
        return {
            from: '"E2Z Bank" <no_reply@e2zbank.com>',
            to: emailAddr,
            subject: "E2Z Staff Login Otp",
            text: `Your login otp for EZBank Staff Portal is ${otp}. This code expires in 5 minutes.`,
        }
    }

    async sendOtp(emailAddr: string, otp: string) {
        try {
            const sender = await this.transporter.sendMail(this.message(emailAddr, otp));
            this.appLogger.log("Mail sent")

            return sender;
        }
        catch (e) {
            this.appLogger.log(e);
            throw new Error(e.message);
        }

    }

    async sendAdminOtp(emailAddr: string, otp: string, isLogin: boolean) {
        try {
            const otpMessage = isLogin ? this.adminLogin(emailAddr, otp) : this.adminMessage(emailAddr, otp)
            
            const sender =await this.transporter.sendMail(otpMessage);
            this.appLogger.log("Mail sent")

            return sender;
        }
        catch (e) {
            this.appLogger.log(e);
            throw new Error(e.message);
        }

    }

    async sendForgotPasswordOtp(emailAddr: string, otp: string) {
        try {
            const sender =await this.transporter.sendMail(this.sendForgotPasswordMessage(emailAddr,otp));
            this.appLogger.log("Mail sent")

            return sender;
        }
        catch (e) {
            this.appLogger.log(e);
            throw new Error(e.message);
        }

    }


}