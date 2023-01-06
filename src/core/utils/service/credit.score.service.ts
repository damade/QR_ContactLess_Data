import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreditScoreRate } from "@prisma/client";

@Injectable()
export class CreditScoreService {

    constructor(
    ) { }

    /**
 * Send Referral Code
 * @param {String} recipient
 * @returns {object}
 */

    testCreditScore = (min: number = 300, max: number = 850): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    testInternalCreditScore = (min: number = 0.0, max: number = 1.0): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    testRepaymentScore = (min: number = 0.0, max: number = 0.6): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    creditScoreRate = (creditScore: number): CreditScoreRate => {
        if (creditScore < 300) {
            throw new HttpException("Invalid Credit Score", HttpStatus.UNPROCESSABLE_ENTITY)
        } else if (creditScore >= 300 && creditScore <= 599){
            return CreditScoreRate.Bad
        } else if (creditScore >= 600 && creditScore <= 649){
            return CreditScoreRate.Poor
        }else if (creditScore >= 650 && creditScore <= 699){
            return CreditScoreRate.Fair
        }else if (creditScore >= 700 && creditScore <= 749){
            return CreditScoreRate.Good
        }else if (creditScore >= 750 && creditScore <= 799){
            return CreditScoreRate.Better
        }else if (creditScore >= 800 && creditScore <= 850){
            return CreditScoreRate.Excellent
        } else {
            throw new HttpException("You have been way out", HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }

    shouldBeDemoted = (currentCreditScore: number, newCreditScore: number): boolean => {
        if(newCreditScore < currentCreditScore){
            if(currentCreditScore <= 599 && newCreditScore <= 599){
                return false
            }else{
                const remainder = Math.floor((Math.abs(currentCreditScore - newCreditScore) / 50))
                if(remainder > 1){
                    true
                }else{
                    false
                }
            }
        }

        return false
    }
}