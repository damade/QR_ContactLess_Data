import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BankService } from './bank.service';
import { BankDto } from './dto/bank.dto';

@Controller('web/bank')
@Public()
export class BankController {

    constructor(private readonly bankService : BankService,
        private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async addBankCode(@Body() bankDto: BankDto) {
        const addedBank = await this.bankService.saveBankCode(bankDto);
         // return the user and the token
         const data: ApiData = { success: true, message: "Bank Added Successfully.",
         payload: { addedBank } };
        return data
    }
    
    @Get('all')
    @HttpCode(HttpStatus.OK)
    async getBankCode() {
        const allBanks = await this.bankService.getAllBanks();
        // return the user and the token
        const data: ApiData = { success: true, message: "Banks Fetched Successfully",
         payload: { allBanks } };
        return data
    }

    @Get('thrash')
    @HttpCode(HttpStatus.OK)
    async getBankThras() {
        const allBanks = await this.bankService.klogin();
        // return the user and the token
        const data: ApiData = { success: true, message: "Login Successfully",
         payload: { allBanks } };
        return data
    }

    @Delete('single')
    @HttpCode(HttpStatus.OK)
    async deleteBankCode(@Body() bank: string ) {
        const deletedBanks = await this.bankService.deleteBankCode(bank);
        this.appLogger.log(deletedBanks)
        // return the user and the token
        const data: ApiData = { success: true, message: "Bank Deleted Successfully",
         payload: { deletedBanks } };
        return data
    }
}
