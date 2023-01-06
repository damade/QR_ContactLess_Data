import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SmsService } from "./sms.service";
import ReferralCode from '../../model/referral.entity'
import * as moment from "moment";
import { isExpired } from "../helpers/time.helper";
import { getRndInteger } from "../helpers/math.helper";
import { getErrorMessage } from "../helpers/error.helper";
import { EmailService } from "./email.service";
import { generateReferralCode } from "../helpers/string.helper";
import { IReferralCode } from "src/core/model/referral.entity";

@Injectable()
export class ReferralCodeService {

    constructor(
    ) { }

    /**
 * Send Referral Code
 * @param {String} recipient
 * @returns {object}
 */

    sendReferralCode = async () => {

        const referralCode = generateReferralCode(3,3);
        // send the referral code
        const checkReferralCode = await this.getReferralCode(referralCode);
        if (!checkReferralCode) {
            // save Referral Code
            await this.saveReferralCode(referralCode);
        } else {
            // update OTP
           this.sendReferralCode()
           return
        }

        return referralCode;
    };


    private getReferralCode = async (code): Promise<IReferralCode> => {
        return await ReferralCode.findOne({ code }).then((referralCode: IReferralCode) => {
            if (!referralCode) {
                return null
            }
            return referralCode
        })
            .catch(error => {
                // console.error(error.message);
                console.log(error.message);
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

   private saveReferralCode = async (code) => {
        const referralCodeDoc: IReferralCode = new ReferralCode({
            code
        });
        referralCodeDoc.save();
        return referralCodeDoc;
    };
}