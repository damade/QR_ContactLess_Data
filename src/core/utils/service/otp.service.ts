import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SmsService } from "./sms.service";
import OTP from '../../model/otp.entity'
import Otp, { IOtp } from '../../model/otp.entity';
import * as moment from "moment";
import { isExpired } from "../helpers/time.helper";
import { getRndInteger } from "../helpers/math.helper";
import { getErrorMessage } from "../helpers/error.helper";
import { EmailService } from "./email.service";
import { AppLogger } from "src/core/logger/logger";

@Injectable()
export class OtpService {

    constructor(
        private readonly smsService: SmsService,
        private readonly emailService: EmailService,
        private readonly appLogger: AppLogger
    ) { }

    /**
 * Send OTP
 * @param {String} recipient
 * @returns {object}
 */

    sendOtp = async (recipientPhoneNumber: string, recipientEmailAddress: string) => {

        const otp = getRndInteger(100000, 999999);
        // save the otp with the mobile number
        const checkOtp = await this.getOTP(recipientPhoneNumber, recipientEmailAddress);
        if (!checkOtp) {
            // save OTP
            await this.saveOTP(recipientPhoneNumber, recipientEmailAddress, otp);
        } else {
            // update OTP
            const expires = moment().add(process.env.OTP_EXPIRATION_TIME, 'minutes')
            await this.updateOTP(recipientPhoneNumber, {
                mobile_number: recipientPhoneNumber,
                otp,
                blacklisted: false,
                expires
            });
        }

        const send_message = this.smsService
            .sendOtp(recipientPhoneNumber, otp)
            .finally(() => {
                if (recipientEmailAddress) {
                    this.emailService.sendOtp(recipientEmailAddress, otp)
                }
            })


        return send_message;
    };

    sendEmailOtp = async (recipientPhoneNumber: string, recipientEmailAddress: string) => {

        const otp = getRndInteger(100000, 999999);
        // save the otp with the mobile number
        const checkOtp = (await this.getOTP(recipientPhoneNumber, recipientEmailAddress))
            .find(Otps => Otps.email == recipientEmailAddress && Otps.mobile_number == recipientPhoneNumber);
        if (!checkOtp) {
            // save OTP
            await this.saveOTP(recipientPhoneNumber, recipientEmailAddress, otp);
        } else {
            // update OTP
            const expires = moment().add(process.env.OTP_EXPIRATION_TIME, 'minutes')
            await this.updateEmailOTP(recipientEmailAddress, {
                email: recipientEmailAddress,
                otp,
                blacklisted: false,
                expires
            });
        }

        const send_message = this.emailService.sendOtp(recipientEmailAddress, otp);

        return send_message;
    };

    sendAdminEmailOtp = async (recipientPhoneNumber: string, recipientEmailAddress: string, isLogin: boolean) => {

        const otp = getRndInteger(100000, 999999);
        // save the otp with the mobile number
        const checkOtp = (await this.getOTP(recipientPhoneNumber, recipientEmailAddress))
            .find(Otps => Otps.email == recipientEmailAddress && Otps.mobile_number == recipientPhoneNumber);
        if (!checkOtp) {
            // save OTP
            await this.saveOTP(recipientPhoneNumber, recipientEmailAddress, otp);
        } else {
            // update OTP
            const expires = moment().add(process.env.OTP_EXPIRATION_TIME, 'minutes')
            await this.updateEmailOTP(recipientEmailAddress, {
                email: recipientEmailAddress,
                otp,
                blacklisted: false,
                expires
            });
        }

        const send_message = this.emailService.sendAdminOtp(recipientEmailAddress, otp, isLogin);

        return send_message;
    };


    verifyOtp = async (mobile_number, otp) => {
        // compare saved otp/mobile number with the incoming one
        const savedOtp = await this.getUnusedOTP(mobile_number);

        if (!savedOtp) {
            throw new HttpException('OTP used earlier', HttpStatus.UNAUTHORIZED);
        }

        if (savedOtp.otp !== otp) {
            throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);

        }
        const is_expired = isExpired(savedOtp.expires);

        if (is_expired) {
            throw new HttpException('OTP expired already', HttpStatus.UNAUTHORIZED);
        }

        await this.blacklistOTP(mobile_number);
        return true;
    };

    verifyEmailOtp = async (email, otp) => {
        // compare saved otp/mobile number with the incoming one
        const savedOtps = await this.getUnusedOTPEmail(email);

        const savedOtp = savedOtps.find(Otps => Otps.otp == otp)

        if (!savedOtps || !savedOtp || savedOtp.otp !== otp) {
            throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);

        }
        const is_expired = isExpired(savedOtp.expires);

        if (is_expired) {
            throw new HttpException('OTP expired already', HttpStatus.UNAUTHORIZED);
        }

        await this.blacklistEmailOTP(email);
        return true;
    };

    saveOTP = async (mobile_number, email, otp, blacklisted = false) => {
        const expires = moment().add(process.env.OTP_EXPIRATION_TIME, 'minutes');
        const otpDoc: IOtp = new OTP({
            mobile_number,
            email,
            otp,
            expires,
            blacklisted,
        });
        otpDoc.save();
        return otpDoc;
    };


    getOTP = async (mobile_number, email): Promise<IOtp[]> => {
        return await OTP.find({ $or: [{ mobile_number: mobile_number }, { email: email }] }).then((otp: IOtp[]) => {
            if (!otp) {
                return null
            }
            return otp
        })
            .catch(error => {
                // console.error(error.message);
                this.appLogger.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    getEmailOTP = async (email): Promise<IOtp[]> => {
        return await OTP.find({ email, blacklisted: true }).then((otp: IOtp[]) => {
            if (!otp) {
                return null
            }
            return otp
        })
            .catch(error => {
                // console.error(error.message);
                this.appLogger.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    getUnusedOTP = async (mobile_number) => {
        return await OTP.findOne({ mobile_number, blacklisted: false }).then((otp: IOtp) => {
            if (!otp) {
                return null
            }
            return otp
        })
            .catch(error => {
                // console.error(error.message);
                this.appLogger.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    getUnusedOTPEmail = async (email) => {
        return await OTP.find({ email, blacklisted: false }).then((otps: IOtp[]) => {
            if (!otps) {
                return null
            }
            return otps
        })
            .catch(error => {
                // console.error(error.message);
                this.appLogger.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    updateOTP = async (mobile_number, payload) => {
        const updated = await OTP.updateOne({ mobile_number }, { "$set": payload })
        if (!updated) {
            throw new HttpException('Error creating OTP', HttpStatus.BAD_REQUEST);
        }
        return updated;
    }

    updateEmailOTP = async (email, payload) => {
        const updated = await OTP.updateOne({ email }, { "$set": payload })
        if (!updated) {
            throw new HttpException('Error creating OTP', HttpStatus.BAD_REQUEST);
        }
        return updated;
    }

    blacklistOTP = async (mobile_number) => {
        const blacklisted = await OTP.updateOne({ mobile_number }, { "$set": { blacklisted: true } })
        if (!blacklisted) {
            throw new HttpException('Error blacklisting OTP', HttpStatus.BAD_REQUEST);
        }
        return blacklisted;
    }

    blacklistEmailOTP = async (email) => {
        const blacklisted = await OTP.updateOne({ email }, { "$set": { blacklisted: true } })
        if (!blacklisted) {
            throw new HttpException('Error blacklisting OTP', HttpStatus.BAD_REQUEST);
        }
        return blacklisted;
    }
}