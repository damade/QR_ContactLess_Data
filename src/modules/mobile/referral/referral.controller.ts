import { Controller, Get, HttpCode, Request, HttpStatus, Query } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { ReferralService } from './referral.service';

@Controller('customer/referral')
export class ReferralController {

    constructor(private readonly referralService: ReferralService,
        private readonly appLogger: AppLogger) { }

    @Get('history')
    @HttpCode(HttpStatus.OK)
    async getReferralEarnedHistory(@Request() req, @Query('page') page: string, 
    @Query('limit') limit: string) {
        const id = req.user.id;
        const history = await this.referralService.getReferralBonusHistory(id, page, limit);
        this.appLogger.log(history)
        
        // return the history
        return history
    }

    @Get('info')
    @HttpCode(HttpStatus.OK)
    async getReferralInfo(@Request() req) {
        const id = req.user.id;
        const info = await this.referralService.getUserReferralInfo(id);
        this.appLogger.log(info)
        
        // return the history
        const data: ApiData = {
            success: true, message: "Referral Bonus Info Fetched Successfully",
            payload: info
        };
        return data
    }

    @Get('earnable')
    @HttpCode(HttpStatus.OK)
    async getEarnableReferralBonus(@Request() req) {
        const id = req.user.id;
        const earnable = await this.referralService.getReferralBonus(id);
        this.appLogger.log(earnable)
       
        // return the earnable
        return earnable
    }
}
