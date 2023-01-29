import {
    Controller, Request, HttpCode, HttpStatus, 
    Get} from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BvnService } from './bvn.service';

@Controller('customer/bvn')
export class BvnController {
    constructor(
        private readonly bvnService: BvnService,
        private readonly appLogger: AppLogger
    ) { }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const bvnInfo = await this.bvnService.findOneById(req.user.id);
        this.appLogger.log(bvnInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bvn Fetched Successfully",
            payload: { bvnInfo }
        };
        return data
    }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async deleteBvnInfo(@Request() req) {
        const bvnInfo = await this.bvnService.deleteOneById(req.user.id);
        this.appLogger.log(bvnInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bvn Deleted Successfully",
            payload: { bvnInfo }
        };
        return data
    }


}
