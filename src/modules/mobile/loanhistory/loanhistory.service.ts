import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import * as dotenv from 'dotenv';
import { ApiData } from 'src/core/model/api.data';
import { AppLogger } from 'src/core/logger/logger';
import { LoanInfo } from '@prisma/client';
import { LoanHistoryPreview } from './model/loanhistory.mobile.info';
import { LoanHistoryPrismaService } from './service/loanhistory.prisma.service';
dotenv.config();

@Injectable()
export class LoanHistoryService {

    constructor(
        private readonly loanHistoryPrismaService: LoanHistoryPrismaService,
        private readonly appLogger: AppLogger) { }


    
    //I was half asleep while writing it 14th of July, 2022.
    async getLoanHistories(customerId: string): Promise<LoanInfo[]> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.loanHistoriesByUserId({
                userId: Number(customerId),
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }   

     //I was half asleep while writing it 14th of July, 2022.
     async getLoanHistoriesPreview(customerId: string): Promise<LoanHistoryPreview[]> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.loanHistoriesPreviewByUserId({
                userId: Number(customerId),
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }   
    
    //I was half asleep while writing it 14th of July, 2022.
    async getLoanHistory(customerId: string): Promise<LoanInfo> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.loanHistoryByUserId({
                userId: Number(customerId),
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    //Gets Basic Loan Info For Now
    async getLoanInfo(uniqueId: string): Promise<LoanInfo> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.loanInfo({
                uniqueId: uniqueId,
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Gets Basic Loan Info For Now
    async getLoanInfoPreview(uniqueId: string): Promise<LoanHistoryPreview> {
        try {
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.loanInfoPreview({
                uniqueId: uniqueId,
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    //I was half asleep while writing it 14th of July, 2022.
    async getPaginatedLoanHistories(customerId: string, page: string, limit: string ): Promise<LoanInfo[]> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.paginatedLoanHistoriesByUserId(
                {page: Number(page), limit: Number(limit)},
                {
                userId: Number(customerId),
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //I was half asleep while writing it 14th of July, 2022.
    async getPaginatedLoanHistoriesPreview(customerId: string, page: string, limit: string ): Promise<LoanHistoryPreview[]> {
        try {
            
            //Fetches Referral Info
            return await this.loanHistoryPrismaService.paginatedLoanHistoriesPreviewByUserId(
                {page: Number(page), limit: Number(limit)},
                {
                userId: Number(customerId),
                })

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



}
