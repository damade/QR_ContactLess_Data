import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreditScoreRate, EmploymentStatus, LoanEligibility, LoanEligibilityIssue, LoanTier, SetupStatus } from '@prisma/client';
import { AppLogger } from 'src/core/logger/logger';
import { monthDiff } from 'src/core/utils/helpers/time.helper';
import { CreditScoreService } from 'src/core/utils/service/credit.score.service';
import { LoaninfoWebService } from 'src/modules/public/loaninfo/loaninfo.service';
import { LoanRateService } from 'src/modules/public/loaninfo/loanrate.service';
import { ILoanRate, LoanType } from 'src/modules/public/loaninfo/model/loan.rate.entity';
import { EligibilityService } from '../../eligibility/eligibility.service';
import { EmploymentService } from '../../employment/employment.service';
import { LoaninfoModule } from '../../loaninfo/loaninfo.module';
import { LoaninfoService } from '../../loaninfo/loaninfo.service';
import { ReferralService } from '../../referral/referral.service';
import { UsersService } from '../../users/users.service';
import { LoanApplicationInfo } from '../model/loaninfo.model';

@Injectable()
export class PersonalLoanPreApplicationService {
    constructor(
        private readonly appLogger: AppLogger,
        private readonly loaninfoWebService: LoaninfoWebService,
        private readonly loanrateService: LoanRateService,
        private readonly loaninfoService: LoaninfoService,
        private readonly userService: UsersService,
        private readonly creditScoreService: CreditScoreService,
        private readonly employmentService: EmploymentService,
        private readonly loanEligibilityService: EligibilityService,
        private readonly referralService: ReferralService

    ) { }

    //Fetches Loan Level Of A User   
    async personalLoanApplicationRequest(customerId: number, loanType: LoanType):
        Promise<LoanApplicationInfo> {

        //Get Loan Eligibility     
        var userLoanEligibility = await this.loanEligibilityService
            .findUserLoanEligibility(customerId);

        //Get Loan Issue List    
        const issuesList = userLoanEligibility.issues

        //Checks and screen out the issues and return the message to User.
        if (userLoanEligibility && issuesList.length > 0) {
            if (issuesList.filter(issue => issue == LoanEligibilityIssue.Profile).length > 0) {
                throw new HttpException(LoanEligibilityIssue.Profile, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if (loanType == LoanType.Personal && issuesList.filter(issue => issue == LoanEligibilityIssue.EmploymentProfile).length > 0) {
                throw new HttpException(LoanEligibilityIssue.EmploymentProfile, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if (issuesList.filter(issue => issue == LoanEligibilityIssue.NoBankDetails).length > 0) {
                throw new HttpException(LoanEligibilityIssue.NoBankDetails, HttpStatus.UNPROCESSABLE_ENTITY);
            } else if (issuesList.filter(issue => issue == LoanEligibilityIssue.GuarantorProfile).length > 0) {
                throw new HttpException(LoanEligibilityIssue.GuarantorProfile, HttpStatus.UNPROCESSABLE_ENTITY);
            } else if (issuesList.filter(issue => issue == LoanEligibilityIssue.OldDebt).length > 0) {
                throw new HttpException(LoanEligibilityIssue.OldDebt, HttpStatus.UNPROCESSABLE_ENTITY);
            } else if (issuesList.filter(issue => issue == LoanEligibilityIssue.NoCreditScore).length > 0) {
                throw new HttpException(LoanEligibilityIssue.NoCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
            } else if (issuesList.filter(issue => issue == LoanEligibilityIssue.LowCreditScore).length > 0) {
                throw new HttpException(LoanEligibilityIssue.LowCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }

        //Checks If You have Any Reason To Not Take A loan
        if (userLoanEligibility.currentTier == LoanTier.None) {
            throw new HttpException("You are not eligible for the loan, contact Kadick.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        //Checks If You Do Not Have Credit Score At Any Point
        if (!userLoanEligibility.creditScore || !userLoanEligibility.creditScoreRate) {
            this.loanEligibilityService
                .updateEligibilityIssue(customerId, LoanEligibilityIssue.NoCreditScore)
            throw new HttpException(LoanEligibilityIssue.NoCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (monthDiff(userLoanEligibility.creditScoreUpdatedAt, new Date()) > 3) {

            //Get the Current Score Rate
            const currentCreditScore = userLoanEligibility.creditScore;

            //Get the Credit Score And Its Rate
            const creditScore = this.creditScoreService.testCreditScore();
            const creditScoreRate = this.creditScoreService.creditScoreRate(creditScore);

            const shouldBeDemoted = this.creditScoreService.shouldBeDemoted(currentCreditScore, creditScore);

            if (shouldBeDemoted) {
                //Update New Credit Score
                userLoanEligibility = await this.loanEligibilityService
                    .updateUserCreditScore(customerId, creditScore, creditScoreRate)
            } else {
                const loanTier = this.getDemotedTier(userLoanEligibility.currentTier);
                //Update New Credit Score With Demoted Tier
                userLoanEligibility = await this.loanEligibilityService
                    .updateUserCreditScorWithTier(customerId, loanTier,
                        creditScore, creditScoreRate)
            }


            //Update the userLoanEligibility
            userLoanEligibility = await this.loanEligibilityService
                .findUserLoanEligibility(customerId)
        }

        //Checks If Credit Score Is So Bad.
        if (userLoanEligibility.creditScoreRate == CreditScoreRate.Bad && userLoanEligibility.currentTier != LoanTier.Tier0) {
            this.loanEligibilityService.addEligibilityIssue(customerId, LoanEligibilityIssue.LowCreditScore)
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        //Fetches The Employment Profile And Handles It Based On Their Profile
        const userEmployment = await this.employmentService.getEmploymentProfile(String(customerId))

        //For Employed and SelfEmployed: Do the Below
        if (userEmployment.employmentStatus == EmploymentStatus.Employed
            || userEmployment.employmentStatus == EmploymentStatus.Selfemployed) {

            //Get Loan Tier Range
            const loanTier = await this.loaninfoWebService.getLoanTierInfo(userLoanEligibility.currentTier)

            var salaryRange;
            if (userEmployment.monthlyIncome > loanTier.maxRange) {
                salaryRange = ((0.3) * loanTier.maxRange)
            } else {
                salaryRange = ((0.3) * userEmployment.monthlyIncome)
            }

            var creditScoreRange = this.creditScoreRangeGetter(userLoanEligibility.creditScoreRate,
                loanTier.maxRange)

            
            //Creating the maximum range
            var maxLoanRange;

            if (userLoanEligibility.currentTier == LoanTier.Tier0) {
                maxLoanRange = (creditScoreRange + salaryRange) / 2
            }
            else {
                //Gets The Internal Credit Score
                userLoanEligibility = await this.getAndSetInternalCredit(customerId)
                const internalCreditScoreRange = ((userLoanEligibility.internalCreditScore) * loanTier.maxRange)
                maxLoanRange = (creditScoreRange + salaryRange + internalCreditScoreRange) / 3
            }

            const loanRateInfo = await this.loaninfoService.loanRateByFilter({loanType})

            const loanApplication: LoanApplicationInfo = {
                currentLoanTier: userLoanEligibility.currentTier,
                minRange: 0,
                maxRange: maxLoanRange,
                loanRate: loanRateInfo
            }
            return loanApplication
        } else if (userEmployment.employmentStatus == EmploymentStatus.Unemployed) {

        
            //Get Loan Tier Range
            const loanTier = await this.loaninfoWebService.getLoanTierInfo(userLoanEligibility.currentTier)

            var noSalaryRange = this.unemployedNoSalaryRangeGetter(
                userEmployment.unEmploymentDuration,
                loanTier.maxRange
            )

            var creditScoreRange = this.unemployedCreditScoreRangeGetter(userLoanEligibility.creditScoreRate,
                loanTier.maxRange)


            if (userLoanEligibility.currentTier == LoanTier.Tier0) {
                maxLoanRange = (creditScoreRange + noSalaryRange) / 2
            }
            else {
                //Gets The Internal Credit Score
                userLoanEligibility = await this.getAndSetInternalCredit(customerId)
                const internalCreditScoreRange = ((userLoanEligibility.internalCreditScore) * loanTier.maxRange)
                maxLoanRange = (creditScoreRange + noSalaryRange + internalCreditScoreRange) / 3
            }

            const loanRateInfo = await this.loaninfoService.loanRateByFilter({loanType})

            const loanApplication: LoanApplicationInfo = {
                currentLoanTier: userLoanEligibility.currentTier,
                minRange: 0,
                maxRange: maxLoanRange,
                loanRate: loanRateInfo
            }
            return loanApplication
        }
    }

    private async getAndSetInternalCredit(customerId: number): Promise<LoanEligibility> {
        var internalScore = 0

        await this.referralService
            .getAvailableReferralBonus(customerId)
            .then(result => {
                if (result && result.length > 1) {
                    internalScore += 0.1
                }
            })

        await this.userService.findOneByUserId(customerId)
            .then(result => {
                const guarantor = result.guarantor
                if (guarantor && guarantor.approvalStatus == SetupStatus.Approved) {
                    internalScore += 0.3
                } else if (guarantor && guarantor.approvalStatus == SetupStatus.Pending) {
                    internalScore += 0.2
                }
            })

        internalScore += (this.creditScoreService.testRepaymentScore())
        return this.loanEligibilityService.updateInternalCreditScore(Number(customerId), internalScore)
    }

    private creditScoreRangeGetter = (creditScoreRate: CreditScoreRate, tierMaxRange: number) => {
        if (creditScoreRate == CreditScoreRate.Poor) {
            return ((0.2) * tierMaxRange)
        }else if (creditScoreRate == CreditScoreRate.Bad) {
            return ((0.1) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Fair) {
            return ((0.4) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Good) {
            return ((0.6) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Better) {
            return ((0.8) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Excellent) {
            return ((1.0) * tierMaxRange)
        } else {
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    private unemployedCreditScoreRangeGetter = (creditScoreRate: CreditScoreRate, tierMaxRange: number) => {
        if (creditScoreRate == CreditScoreRate.Bad) {
            return ((0.05) * tierMaxRange)
        }else if (creditScoreRate == CreditScoreRate.Poor) {
            return ((0.1) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Fair) {
            return ((0.2) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Good) {
            return ((0.3) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Better) {
            return ((0.4) * tierMaxRange)
        } else if (creditScoreRate == CreditScoreRate.Excellent) {
            return ((0.5) * tierMaxRange)
        } else {
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);

        }
    }

    private unemployedNoSalaryRangeGetter = (months: number, tierMaxRange: number) => {
        if (months <= 1) {
            return ((0.5) * tierMaxRange)
        } else if (months <= 2) {
            return ((0.4) * tierMaxRange)
        } else if (months <= 3) {
            return ((0.3) * tierMaxRange)
        } else if (months <= 4) {
            return ((0.2) * tierMaxRange)
        } else if (months <= 5) {
            return ((0.1) * tierMaxRange)
        } else if (months <= 6) {
            return ((0.05) * tierMaxRange)
        } else {
            throw new HttpException("You have been way out", HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }

    private getDemotedTier = (currentTier: LoanTier): LoanTier => {
        if (currentTier == LoanTier.Tier0) {
            return LoanTier.Tier0
        }else if (currentTier == LoanTier.Tier1) {
            return LoanTier.Tier0
        }else if (currentTier == LoanTier.Tier2) {
            return LoanTier.Tier1
        }else if (currentTier == LoanTier.Tier3) {
            return LoanTier.Tier2
        }else if (currentTier == LoanTier.Tier4) {
            return LoanTier.Tier3
        }else if (currentTier == LoanTier.Tier5) {
            return LoanTier.Tier4
        }else {
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);

        }
    }



}
