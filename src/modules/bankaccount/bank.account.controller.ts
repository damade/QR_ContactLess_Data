import { Controller, Request, HttpCode, HttpStatus, Get, Delete } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BankAccountService } from './bank.account.service';

@Controller('customer/bank-info')
export class BankAccountController {
    constructor(
        private readonly bvnService: BankAccountService,
        private readonly appLogger: AppLogger
    ) { }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const bvnInfo = await this.bvnService.findOneById(req.user.id);
        this.appLogger.log(bvnInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bank Info Fetched Successfully",
            payload: { bvnInfo }
        };
        return data
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async deleteBvnInfo(@Request() req) {
        const bvnInfo = await this.bvnService.deleteOneById(req.user.id);
        this.appLogger.log(bvnInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bank Info Deleted Successfully",
            payload: { bvnInfo }
        };
        return data
    }


}
