import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { LoanRateService } from './loanrate.service';
import { LoanRateInfoDto } from './model/loanrate.info.dto';
import { LoanRateInfoUpdateDto } from './model/loanrate.info.update.dto';

@Controller('web/loan-rate')
@Public()
export class LoanInfoRateController {
    constructor(private readonly loanRateService : LoanRateService,
        private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async addLoanRateInfo(@Body() loanRateInfoDto: LoanRateInfoDto) {
        const addedLoanRate = await this.loanRateService.saveLoanRate(loanRateInfoDto);
         // return the user and the token
         const data: ApiData = { success: true, message: "Loan Rate Added Successfully.",
         payload: { addedLoanRate } };
        return data
    }

    @Patch('update/:uniqueId')
    @HttpCode(HttpStatus.CREATED)
    async updateLoanRate(@Param('uniqueId') uniqueId: string , @Body() updateDto: LoanRateInfoUpdateDto) {
        const updatedLoanRate = await this.
        loanRateService.updateLoanRate(uniqueId,updateDto);
        this.appLogger.log(updatedLoanRate)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Loan Rate Updated Successfully.",
            payload: updatedLoanRate
        };
        return data
    }

    
    @Get('all')
    @HttpCode(HttpStatus.OK)
    async getLoanRates() {
        const allLoanRatesInfo = await this.loanRateService.getAllLoanRatesInfo();
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Rates Fetched Successfully",
         payload: { allLoanRatesInfo } };
        return data
    }

    @Get('id/:uniqueId')
    @HttpCode(HttpStatus.OK)
    async getLoanRateViaUniqueId(@Param('uniqueId') uniqueId: string) {
        const allLoanRatesInfo = await this.loanRateService.getLoanRateInfoViaUniqueId(uniqueId);
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Rates Fetched Successfully",
         payload: { allLoanRatesInfo } };
        return data
    }


    @Get('tenure/:tenure')
    @HttpCode(HttpStatus.OK)
    async getLoanRateViaTenure(@Param('tenure') tenure: string) {
        const allLoanRatesInfo = await this.loanRateService.getLoanRateInfoViaTenure(tenure);
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Rates Fetched Successfully",
         payload: { allLoanRatesInfo } };
        return data
    }

    @Delete('delete/:uniqueId')
    @HttpCode(HttpStatus.OK)
    async deleteBankCode(@Param('uniqueId') uniqueId: string) {
        const deletedLoanRate = await this.loanRateService.deleteLoanRateInfo(uniqueId);
        this.appLogger.log(deletedLoanRate)
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Rate Deleted Successfully",
         payload: { deletedLoanRate} };
        return data
    }
}
