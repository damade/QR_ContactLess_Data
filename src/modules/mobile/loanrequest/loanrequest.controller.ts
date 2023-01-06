import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Query, Request } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { LoanType } from 'src/modules/public/loaninfo/model/loan.rate.entity';
import { LoanRequestDto } from './dto/loan.request.dto';
import { LoanApplicationService } from './providers/loanapplication.service';
import { PersonalLoanPreApplicationService } from './providers/personalLoanpreapplication.service';

@Controller('customer/loanrequest')
export class LoanrequestController {

    constructor(
        private readonly loanPreApplicationService: PersonalLoanPreApplicationService,
        private readonly loanApplicationService: LoanApplicationService,
        private readonly appLogger: AppLogger) { }


    @Get('personal')
    @HttpCode(HttpStatus.OK)
    async getPersonalLoanRequest(@Request() req, @Query("loanType") loanType: LoanType) {
        const userId = Number(req.user.id)

        if(!loanType || loanType != LoanType.Personal ){
            throw new HttpException("Loan Type Query Must Be Personal", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const userLoan = await this.loanPreApplicationService.personalLoanApplicationRequest(userId, loanType)
         
        // return the user business profile
        const data: ApiData = { success: true,
             message: "Info has been Fetched Successfully",
         payload: userLoan } ;
        return data
    }

    @Get('business')
    @HttpCode(HttpStatus.OK)
    async getBusinessLoanRequest(@Request() req, @Query("loanType") loanType: LoanType) {
        const userId = Number(req.user.id)

        if(!loanType || loanType == LoanType.Business ){
            throw new HttpException("Loan Type Query Must Be Business", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const userLoan = await this.loanPreApplicationService.personalLoanApplicationRequest(userId, loanType)
         
        // return the user business profile
        const data: ApiData = { success: true,
             message: "Info has been Fetched Successfully",
         payload: userLoan } ;
        return data
    }

    @Get('apply-personal')
    @HttpCode(HttpStatus.OK)
    async getPersonalLoanApplication(@Request() req, @Query("loanType") loanType: LoanType,
    @Body() loanRequestInput: LoanRequestDto) {
        const userId = Number(req.user.id)

        this.appLogger.log(loanType)

        if(!loanType || loanType != LoanType.Personal ){
            throw new HttpException("Loan Type Query Must Be Personal", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const userLoan = await this.loanApplicationService.personalLoanApplication(userId, loanType, loanRequestInput)
         
        // return the user business profile
        const data: ApiData = { success: true,
             message: "Your loan request has been sent successfully and will be disbursed in few minutes.",
         payload: userLoan } ;
        return data
    }


}
