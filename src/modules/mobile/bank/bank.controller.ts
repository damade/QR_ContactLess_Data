import { Body, Controller, Get, HttpCode, Request, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BankService } from 'src/modules/public/bank/bank.service';
import { BankDetailsService } from './bank.details.service';
import { BankDetailsDto } from './dto/bank.details.dto';
import { BankDetailsUpdateDto } from './dto/bank.details.update.dto';

@Controller('customer/bank-details')
export class BankDetailsController {

    constructor(private readonly bankService : BankService,
                private readonly bankDetailsService: BankDetailsService,
                private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async fillBanksDetails(@Request() req, @Body() bankDto: BankDetailsDto) {
        const id = req.user.id;
        //const addedBank = await this.bankDetailsService.createBankDetails(id, bankDto);
        const addedBank = await this.bankDetailsService.createBankDetailsWithLoanEligibility(id, bankDto);
        this.appLogger.log(addedBank)
         // return the loan eligibility issues
         const data: ApiData = { success: true, message: "Bank Details Added Successfully.",
         payload: addedBank };
        return data
    }

    @Put(':user_id')
    @HttpCode(HttpStatus.OK)
    async updateBankDetails(@Request() req, @Body() bankDetailsInput: BankDetailsUpdateDto) {
        const id = req.user.id;
        const updatedBankDetails = await this.bankDetailsService.updateBankDetails(id, bankDetailsInput);
        // return the updated bank details
        const data: ApiData = { success: true, message: "Bank Details Updated Successfully",
         payload: updatedBankDetails  };
        return data
    }

    @Get('banks')
    @HttpCode(HttpStatus.OK)
    async getAllBanks() {
        const allBanks = await this.bankService.getAllBanks();
        this.appLogger.log(allBanks)
        // return the list of banks
        const data: ApiData = { success: true, message: "Banks Fetched Successfully",
         payload:  allBanks  };
        return data
    }

    @Get(':user_id')
    @HttpCode(HttpStatus.OK)
    async getBankDetail(@Request() req, @Param('user_id') id: string) {
        const bankDetailInfo = await this.bankDetailsService.getBankDetail(req.user.id);
        this.appLogger.log(bankDetailInfo)
        // return the user bank details
        const data: ApiData = { success: true, message: "Bank Detail Fetched Successfully",
         payload: bankDetailInfo  };
        return data
    }
    
}
