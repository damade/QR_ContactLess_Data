import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreditScoreRate, EmploymentStatus, LoanEligibilityIssue, LoanTier } from '@prisma/client';
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
import { UsersService } from '../../users/users.service';
import { LoanApplicationInfo } from '../model/loaninfo.model';

@Injectable()
export class BusinessLoanPreApplicationService {
    constructor(
        private readonly appLogger: AppLogger,
        private readonly loaninfoWebService: LoaninfoWebService,
        private readonly loanrateService: LoanRateService,
        private readonly loaninfoService: LoaninfoService, 
        private readonly userService: UsersService,
        private readonly creditScoreService: CreditScoreService,
        private readonly employmentService: EmploymentService,
        private readonly loanEligibilityService: EligibilityService

    ) { }

    //Fetches Loan Level Of A User   
    async businessLoanApplicationRequest(customerId: number, loanType: LoanType):
        Promise<LoanApplicationInfo> {

        //Get Loan Eligibility     
        var userLoanEligibility = await this.loanEligibilityService
            .findUserLoanEligibility(customerId);

        //Get Loan Issue List    
        const issuesList = userLoanEligibility.issues    
        
        //Checks and screen out the issues and return the message to User.
        if(userLoanEligibility && issuesList.length > 0){
            if(loanType == LoanType.Personal && issuesList.filter(issue => issue == LoanEligibilityIssue.EmploymentProfile).length > 0){
                throw new HttpException(LoanEligibilityIssue.EmploymentProfile, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if(issuesList.filter(issue => issue == LoanEligibilityIssue.NoBankDetails).length > 0){
                throw new HttpException(LoanEligibilityIssue.NoBankDetails, HttpStatus.UNPROCESSABLE_ENTITY);
            }else if(issuesList.filter(issue => issue == LoanEligibilityIssue.GuarantorProfile).length > 0){
                throw new HttpException(LoanEligibilityIssue.GuarantorProfile, HttpStatus.UNPROCESSABLE_ENTITY);
            }else if(issuesList.filter(issue => issue == LoanEligibilityIssue.OldDebt).length > 0){
                throw new HttpException(LoanEligibilityIssue.OldDebt, HttpStatus.UNPROCESSABLE_ENTITY);
            }else if(issuesList.filter(issue => issue == LoanEligibilityIssue.NoCreditScore).length > 0){
                throw new HttpException(LoanEligibilityIssue.NoCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
            }else if(issuesList.filter(issue => issue == LoanEligibilityIssue.LowCreditScore).length > 0){
                throw new HttpException(LoanEligibilityIssue.LowCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }    

        //Checks If You have Any Reason To Not Take A loan
        if(userLoanEligibility.currentTier == LoanTier.None){
            throw new HttpException("You are not eligible for the loan, contact Kadick.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        //Checks If You Do Not Have Credit Score At Any Point
        if(!userLoanEligibility.creditScore || !userLoanEligibility.creditScoreRate){
            this.loanEligibilityService
            .updateEligibilityIssue(customerId,LoanEligibilityIssue.NoCreditScore)
            throw new HttpException(LoanEligibilityIssue.NoCreditScore, HttpStatus.UNPROCESSABLE_ENTITY);
       
        }

        if(monthDiff(userLoanEligibility.creditScoreUpdatedAt, new Date()) > 3){
            //Get the Credit Score And Its Rate
            const creditScore = this.creditScoreService.testCreditScore();
            const creditScoreRate = this.creditScoreService.creditScoreRate(creditScore);

            this.loanEligibilityService
            .updateUserCreditScore(customerId, creditScore, creditScoreRate)

            userLoanEligibility = await this.loanEligibilityService
            .findUserLoanEligibility(customerId)
        }

        if(userLoanEligibility.creditScoreRate == CreditScoreRate.Bad){
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        
        this.appLogger.log("Before Here 1")

        const loanTier = await this.loaninfoWebService.getLoanTierInfo(userLoanEligibility.currentTier)
        

        this.appLogger.log("Before Here 2")

        const userEmployment = await this.employmentService.getEmploymentProfile(String(customerId))


        this.appLogger.log("Before Here 3")

        if(userEmployment.employmentStatus == EmploymentStatus.Employed 
            || userEmployment.employmentStatus == EmploymentStatus.Selfemployed){

           
            this.appLogger.log("Before Here 7")
     

            var salaryRange;
            if(userEmployment.monthlyIncome > loanTier.maxRange){
              salaryRange = ( (0.3) * loanTier.maxRange)
            }else{
              salaryRange = ( (0.3) * userEmployment.monthlyIncome)
            }


            this.appLogger.log("Before Here 8")


            var creditScoreRange = this.creditScoreRangeGetter(userLoanEligibility.creditScoreRate,
                loanTier.maxRange)
            

            
            this.appLogger.log("Before Here 9")


            const maxLoanRange = (creditScoreRange + salaryRange) / 2


            this.appLogger.log("Before Here 10")


            //const loanRateInfo = await this.loaninfoService.loanRateByFilter(loanType)


            this.appLogger.log("Before Here 11")

            const loanApplication:  LoanApplicationInfo = {
                currentLoanTier: userLoanEligibility.currentTier,
                minRange: 0,
                maxRange: maxLoanRange,
                loanRate: null
            }
            return loanApplication
        }else if(userEmployment.employmentStatus == EmploymentStatus.Unemployed){

            
            this.appLogger.log("Before Here 4")


            var noSalaryRange = this.unemployedNoSalaryRangeGetter(
                userEmployment.unEmploymentDuration,
                loanTier.maxRange
            )

            var creditScoreRange = this.unemployedCreditScoreRangeGetter(userLoanEligibility.creditScoreRate,
                loanTier.maxRange)
            

            const maxLoanRange = (creditScoreRange + noSalaryRange) / 2

            this.appLogger.log("Before Here 5")

            const loanRateInfo = await this.loaninfoService.loanRateByFilter(LoanType.Personal)


            this.appLogger.log("Before Here 6")

            const loanApplication:  LoanApplicationInfo = {
                currentLoanTier: userLoanEligibility.currentTier,
                minRange: 0,
                maxRange: maxLoanRange,
                loanRate: loanRateInfo
            }
            return loanApplication
        }
    }




    private creditScoreRangeGetter = (creditScoreRate: CreditScoreRate, tierMaxRange: number) =>{
        if(creditScoreRate == CreditScoreRate.Poor){
          return ((0.2) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Fair){
          return ((0.4) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Good){
          return ((0.6) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Better){
           return ((0.8) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Excellent){
           return ((1.0) * tierMaxRange)
        }else{
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    private unemployedCreditScoreRangeGetter = (creditScoreRate: CreditScoreRate, tierMaxRange: number) =>{
        if(creditScoreRate == CreditScoreRate.Bad){
            return ((0.05) * tierMaxRange)
        }if(creditScoreRate == CreditScoreRate.Poor){
          return ((0.1) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Fair){
          return ((0.2) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Good){
          return ((0.3) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Better){
           return ((0.4) * tierMaxRange)
        }else if(creditScoreRate == CreditScoreRate.Excellent){
           return ((0.5) * tierMaxRange)
        }else{
            throw new HttpException("You Credit Score Is Too Low To Take A Loan", HttpStatus.UNPROCESSABLE_ENTITY);
        
        }
    }

   private unemployedNoSalaryRangeGetter = (months: number, tierMaxRange: number) =>{
        if(months <= 1){
          return ((0.5) * tierMaxRange)
        }else if(months <= 2){
          return ((0.4) * tierMaxRange)
        }else if(months <= 3){
          return ((0.3) * tierMaxRange)
        }else if(months <= 4){
           return ((0.2) * tierMaxRange)
        }else if(months <= 5){
           return ((0.1) * tierMaxRange)
        }else if(months <= 6){
            return ((0.05) * tierMaxRange)
         }else{
            throw new HttpException("You have been way out", HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    


}
