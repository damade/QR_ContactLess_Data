import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { LoaninfoWebService } from './loaninfo.service';
import { LoanTierGroup } from './model/loan.tier.entity';
import { LoanTierInfoDto } from './model/loantier.info.dto';
import { LoanTierInfoUpdateDto } from './model/loantier.info.update.dto';

@Controller('web/loan-tier')
@Public()
export class LoaninfoController {
    constructor(private readonly loanInfoService : LoaninfoWebService,
        private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async addLoanInfo(@Body() loanTierInfoDto: LoanTierInfoDto) {
        const addedLoanTier = await this.loanInfoService.saveLoanTier(loanTierInfoDto);
         // return the user and the token
         const data: ApiData = { success: true, message: "Loan Tier Added Successfully.",
         payload:  addedLoanTier  };
        return data
    }

    @Patch('update/:loanTier')
    @HttpCode(HttpStatus.CREATED)
    async updateLoanTierInfo(@Param('loanTier') loanTier: LoanTierGroup , @Body() updateDto: LoanTierInfoUpdateDto) {
        const updatedLoanTier = await this.loanInfoService.updateLoanTier(loanTier, updateDto);
        this.appLogger.log(updatedLoanTier)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Loan Tier Updated Successfully.",
            payload: updatedLoanTier
        };
        return data
    }

    @Patch('update/:userId/:loanTier')
    @HttpCode(HttpStatus.CREATED)
    async updateUserLoanTier(@Param('userId') userId: number, @Param('loanTier') loanTier: LoanTierGroup) {
        const updatedLoanTier = await this.loanInfoService.updateUserLoanTier(userId, loanTier)
        this.appLogger.log(updatedLoanTier)
        // return the user and the token
        const data: ApiData = {
            success: true, message: `User ${userId} Loan Tier Updated Successfully.`,
            payload: updatedLoanTier
        };
        return data
    }

    
    @Get('all')
    @HttpCode(HttpStatus.OK)
    async getLoanTierInfo() {
        const allLoanTiersInfo = await this.loanInfoService.getAllLoanTIersInfo();
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Tiers Fetched Successfully",
         payload:  allLoanTiersInfo  };
        return data
    }

    @Delete('delete/:loanTier')
    @HttpCode(HttpStatus.OK)
    async deleteBankCode(@Param('loanTier') loanTier: LoanTierGroup ) {
        const deletedLoanTier = await this.loanInfoService.deleteLoanTierInfo(loanTier);
        this.appLogger.log(deletedLoanTier)
        // return the user and the token
        const data: ApiData = { success: true, message: "Loan Tier Deleted Successfully",
         payload:  deletedLoanTier };
        return data
    }
}
