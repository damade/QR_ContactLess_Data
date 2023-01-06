import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { LoaninfoService } from './loaninfo.service';

@Controller('customer/loaninfo')
export class LoaninfoController {

    constructor(private readonly loanInfoService: LoaninfoService,
        private readonly appLogger: AppLogger) { }


    @Get('loan-level')
    @HttpCode(HttpStatus.OK)
    async getLoanLevel(@Request() req) {
        const userId = Number(req.user.id)
        const userLoanLevel = await this.loanInfoService.loanLevel(userId);
        // return the user business profile
        const data: ApiData = { success: true, message: "User Loan Level Fetched Successfully",
         payload: userLoanLevel } ;
        return data
    }

    @Get('credit-score')
    @HttpCode(HttpStatus.OK)
    async getCreditScore(@Request() req) {
        const userId = Number(req.user.id)
        const userCreditScore = await this.loanInfoService.creditScore(userId);
        // return the user business profile
        const data: ApiData = { success: true, message: "User Credit Score Fetched Successfully",
         payload: userCreditScore } ;
        return data
    }

    @Get('loan-rates')
    @HttpCode(HttpStatus.OK)
    async getLoanRates() {
        const loanRates = await this.loanInfoService.loanRate();
        // return the user business profile
        const data: ApiData = { success: true, message: "Loan Rates Fetched Successfully",
         payload: loanRates } ;
        return data
    }

    @Get('loan-rates/filter')
    @HttpCode(HttpStatus.OK)
    async getLoanRatesByLoanType(@Query() filter: string) {
        const loanRates = await this.loanInfoService.loanRateByFilter(filter);
        // return the user business profile
        const data: ApiData = { success: true, message: "Filtered Loan Rates Fetched Successfully",
         payload: loanRates } ;
        return data
    }

}
