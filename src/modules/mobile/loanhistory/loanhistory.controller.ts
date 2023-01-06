import { Controller, Get, HttpCode, Request, HttpStatus, Query, Param } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { LoanHistoryService } from './loanhistory.service';

@Controller('customer/loanhistory')
export class LoanHistoryController {

    constructor(private readonly loanHistoryService : LoanHistoryService, 
        private readonly appLogger: AppLogger) { }


    @Get('')
    @HttpCode(HttpStatus.OK)
    async getLoanHistories(@Request() req) {

        this.appLogger.log("")
        const id = req.user.id;
        const history = await this.loanHistoryService.getLoanHistories(id);
        
        const data: ApiData = {
            success: true, message: "Loan History Fetched Successfully",
            payload: history
        };
        return data
    }

    @Get('summary')
    @HttpCode(HttpStatus.OK)
    async getSummarizedLoanHistories(@Request() req) {

        this.appLogger.log("")
        const id = req.user.id;
        const history = await this.loanHistoryService.getLoanHistoriesPreview(id);
        
        const data: ApiData = {
            success: true, message: "Loan History Fetched Successfully",
            payload: history
        };
        return data
    }

    @Get('paginate')
    @HttpCode(HttpStatus.OK)
    async getPaginatedLoanHistories(@Request() req, @Query('page') page: string, 
    @Query('limit') limit: string) {
        const id = req.user.id;

        const history = await this.loanHistoryService.getPaginatedLoanHistories(id, page, limit);
    
        // return the history
        const data: ApiData = {
            success: true, message: "Loan History Fetched Successfully",
            payload: history
        };
        return data
    }

    @Get('summary-pagination')
    @HttpCode(HttpStatus.OK)
    async getSummarizedPaginatedLoanHistories(@Request() req, @Query('page') page: string, 
    @Query('limit') limit: string) {
        const id = req.user.id;

        const history = await this.loanHistoryService.getPaginatedLoanHistoriesPreview(id, page, limit);
    
        // return the history
        const data: ApiData = {
            success: true, message: "Loan History Fetched Successfully",
            payload: history
        };
        return data
    }

    @Get('info/:uniqueId')
    @HttpCode(HttpStatus.OK)
    async getLoanInfo(@Request() req, @Param('uniqueId') uniqueId: string) {
        const id = req.user.id;
        const info = await this.loanHistoryService.getLoanInfo(uniqueId);
        this.appLogger.log(info)
        
         // return the history
         const data: ApiData = {
            success: true, message: "Loan Info Fetched Successfully",
            payload: info
        };
        return data
        
    }

    @Get('summary-info/:uniqueId')
    @HttpCode(HttpStatus.OK)
    async getLoanInfoPreview(@Request() req, @Param('uniqueId') uniqueId: string) {
        const id = req.user.id;
        const info = await this.loanHistoryService.getLoanInfoPreview(uniqueId);
        this.appLogger.log(info)
        
         // return the history
         const data: ApiData = {
            success: true, message: "Loan Info Fetched Successfully",
            payload: info
        };
        return data
        
    }

}
