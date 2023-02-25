import {
    Controller, Body, Request, HttpCode, HttpStatus, Patch,
    Get} from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { AdminUserPasswordChangeDto } from './dto/admin.user.pin.update.dto';
import { AdminUsersService } from './admin.users.service';
import { genericExclude } from 'src/core/utils/helpers/prisma.helper';
import { BankAccountService } from '../bankaccount/bank.account.service';
import { BvnService } from '../bvn/bvn.service';
import { UsersService } from '../users/users.service';

@Controller('admin')
export class AdminUserController {
    constructor(
        private readonly userService: AdminUsersService,
        private readonly bankAccountService: BankAccountService,
        private readonly bvnAccountService: BvnService,
        private readonly customerService: UsersService,
        private readonly appLogger: AppLogger
    ) { }

    @Patch('user/change-pin')
    async changePin(@Body() user: AdminUserPasswordChangeDto, @Request() req) {

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
    async getAdminUserProfile(@Request() req) {
        const profile = await this.userService.findOneById(req.user._id);

        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Profile Fetched Successfully",
            payload: { profile : genericExclude(profile.toJSON(), "bearerToken","__v","password")  }
        };
        return data
    }

    @Get('unapprove/bvn')
    @HttpCode(HttpStatus.OK)
    async getYetToApproveBvnUsers() {
        const bvnRegisters = await this.bvnAccountService.findUnapprovedBvns();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "UnApproved Bvn Users Fetched Successfully",
            payload: { bvnRegisters }
        };
        return data
    }

    @Get('unapprove/user-bvn')
    @HttpCode(HttpStatus.OK)
    async getYetToApproveUsersBvn() {
        const profile = await this.customerService.unApprovedBvns();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "UnApproved Bvn Users Fetched Successfully",
            payload: { profile }
        };
        return data
    }

    @Get('unapprove/bank-info')
    @HttpCode(HttpStatus.OK)
    async getYetToApproveBankInfoUsers() {
        const bvnRegisters = await this.bvnAccountService.findUnapprovedBvns();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "UnApproved Bank Info Users Fetched Successfully",
            payload: { bvnRegisters }
        };
        return data
    }

    @Get('unapprove/user-bank')
    @HttpCode(HttpStatus.OK)
    async getYetToApproveUsersBankInfo() {
        const profile = await this.customerService.unApprovedBvns();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "UnApproved Bank Info Users Fetched Successfully",
            payload: { profile }
        };
        return data
    }

}
