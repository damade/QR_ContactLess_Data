import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { LoaninfoWebService } from 'src/modules/public/loaninfo/loaninfo.service';
import { LoanRateService } from 'src/modules/public/loaninfo/loanrate.service';
import { ILoanRate, LoanType } from 'src/modules/public/loaninfo/model/loan.rate.entity';
import { EligibilityService } from '../eligibility/eligibility.service';
import { CreditScoreInfo, LoanLevelInfo, LoanRateInfo } from './model/loaninfo.model';

@Injectable()
export class LoaninfoService {
    constructor(
        private readonly appLogger: AppLogger,
        private readonly loaninfoWebService: LoaninfoWebService,
        private readonly loanrateService: LoanRateService,
        private readonly loanEligibilityService: EligibilityService

    ) { }

    //Fetches Loan Level Of A User   
    async loanLevel(customerId: number):
        Promise<LoanLevelInfo> {
        const userLoanEligibility = await this.loanEligibilityService
            .findUserLoanEligibility(customerId);
        const loanTiers = await this.loaninfoWebService.getUnCustomAllLoanTIersInfo();

        const loanLevelData: LoanLevelInfo = {
            currentLoanTier: userLoanEligibility.currentTier,
            loanTiers: loanTiers
        };
        return loanLevelData
    }


    //Fetches Credit Score Level Of A User   
    async creditScore(customerId: number):
        Promise<CreditScoreInfo> {
        const userLoanEligibility = await this.loanEligibilityService
            .findUserLoanEligibility(customerId);

        const creditScoreData: CreditScoreInfo = {
            currentLoanTier: userLoanEligibility.currentTier,
            creditScore: userLoanEligibility.creditScore,
            internalCreditScoreRating: ((userLoanEligibility.internalCreditScore) * 5) ,
            creditScoreRate: userLoanEligibility.creditScoreRate
        };
        return creditScoreData
    }

    //Fetches Loan Rate   
    async loanRate():
        Promise<LoanRateInfo[]> {
        const loanRates = await this.loanrateService.getAllUnCustomLoanRatesInfo();

        const formattedLoanRates: LoanRateInfo[] = [{
            loanType: LoanType.Personal.toString(),
            newLoanRate: loanRates.filter((rate) => {
                return rate.loanType == LoanType.Personal
            })
        }, {
            loanType: LoanType.Business.toString(),
            newLoanRate: loanRates.filter((rate) => {
                return rate.loanType == LoanType.Business
            })
        }]
        return formattedLoanRates.filter((rate) => {
            return rate.newLoanRate.length > 0
        })
    }

    //Fecthes Loan Rate By Filter
    async loanRateByFilter(filter):
        Promise<LoanRateInfo[]> {

        const loanRates = await this.loanrateService.getFilterLoanRatesInfo(filter);

        const formattedLoanRates: LoanRateInfo[] = [{
            loanType: LoanType.Personal,
            newLoanRate: loanRates.filter((rate) => {
                return rate.loanType == LoanType.Personal
            })
        }, {
            loanType: LoanType.Business.toString(),
            newLoanRate: loanRates.filter((rate) => {
                return rate.loanType == LoanType.Business
            })
        }, {
            loanType: LoanType.Custom.toString(),
            newLoanRate: loanRates.filter((rate) => {
                return rate.loanType == LoanType.Custom
            })
        }]
        return formattedLoanRates.filter((rate) => {
            return rate.newLoanRate.length > 0
        })
    }


}
