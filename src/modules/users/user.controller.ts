import {
    Controller, Body, Request, HttpCode, HttpStatus, Patch,
    Get} from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { UserPasswordChangeDto } from './dto/user.pin.update.dto';
import { UsersService } from './users.service';

@Controller('customer/users')
export class UserController {
    constructor(
        private readonly userService: UsersService,
        private readonly appLogger: AppLogger
    ) { }

    @Patch('change-pin')
    async changePin(@Body() user: UserPasswordChangeDto, @Request() req) {

        await this.userService.changePassword(req.user.email, user);

        // return the update user
        const data: ApiData = {
            success: true, message: "Pin Updated Successfully",
            payload: {}
        };
        return data
    }


    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const profile = await this.userService.findOneById(req.user.id);
        this.appLogger.log(profile)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Profile Fetched Successfully",
            payload: { profile }
        };
        return data
    }

    @Get('qr-code')
    @HttpCode(HttpStatus.OK)
    async getQrUrl(@Request() req) {
        const qrUrl = await this.userService.fetchUserQrData(req.user.id);
        this.appLogger.log(qrUrl)
        // return the qr url
        const data: ApiData = {
            success: true, message: "User Profile Fetched Successfully",
            payload: { qrUrl }
        };
        return data
    }

    @Get('identification-list')
    @HttpCode(HttpStatus.OK)
    async getIdentificationList() {
        const identificationList = await this.userService.getIdentificationList();
        this.appLogger.log(identificationList)

        // return Identification List
        const data: ApiData = {
            success: true, message: "Identification List Fetched Successfully",
            payload: identificationList
        };
        return data
    }


}
