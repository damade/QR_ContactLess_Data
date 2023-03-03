import {
    Controller, Body, Request, HttpCode, HttpStatus, Patch,
    Get,
    Query} from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { AdminUserPasswordChangeDto } from './dto/admin.user.pin.update.dto';
import { AdminUsersService } from './admin.users.service';
import { genericExclude } from 'src/core/utils/helpers/prisma.helper';
import { RequestForApprovalDto } from './dto/req.approval.dto';

@Controller('admin')
export class AdminUserController {
    constructor(
        private readonly userService: AdminUsersService,
        private readonly appLogger: AppLogger
    ) { }
    
    @Get('user-profile')
    @HttpCode(HttpStatus.CREATED)
    async getUserProfile(@Query("uniqueId") uniqueId, @Query("userId") userId) {

        const user = await this.userService.getCustomerInfo(uniqueId, userId);

        // return the update user
        const data: ApiData = {
            success: true, message: "User Info Fetched Successfully",
            payload: {user}
        };
        
        return data
    }  

    @Patch('bvn-approval')
    @HttpCode(HttpStatus.CREATED)
    async approveBvn(@Body() reqForApproval: RequestForApprovalDto) {

        const updatedUser = await this.userService.approveBvn(reqForApproval);

        // return the update user
        const data: ApiData = {
            success: true, message: "Account Has Been Approved Successfully",
            payload: {updatedUser}
        };
        
        return data
    }    

    @Patch('bank-approval')
    async approveBankInfo(@Body()reqForApproval: RequestForApprovalDto) {

        const updatedUser = await this.userService.approveBankInfo(reqForApproval);

        // return the update user
        const data: ApiData = {
            success: true, message: "Account Has Been Approved Successfully",
            payload: {updatedUser}
        };
        
        return data
    }

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
        const bvnRegisters = await this.userService.getYetToApproveBvnUsers();
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
        const profile = await this.userService.getYetToApproveUsersBvn();
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
        const bvnRegisters = await this.userService.getYetToApproveBankInfoUsers();
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
        const profile = await this.userService.getYetToApproveUsersBankInfo();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "UnApproved Bank Info Users Fetched Successfully",
            payload: { profile }
        };
        return data
    }

    @Get('approve/bvn')
    @HttpCode(HttpStatus.OK)
    async getApprovedBvnUsers() {
        const bvnRegisters = await this.userService.getApprovedBvnUsers();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Approved Bvn Users Fetched Successfully",
            payload: { bvnRegisters }
        };
        return data
    }

    @Get('approve/user-bvn')
    @HttpCode(HttpStatus.OK)
    async getApprovedUsersBvn() {
        const profile = await this.userService.getApprovedUsersBvn();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Approved Bvn Users Fetched Successfully",
            payload: { profile }
        };
        return data
    }

    @Get('approve/bank-info')
    @HttpCode(HttpStatus.OK)
    async getApprovedBankInfoUsers() {
        const bvnRegisters = await this.userService.getApprovedBankInfoUsers();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Approved Bank Info Users Fetched Successfully",
            payload: { bvnRegisters }
        };
        return data
    }

    @Get('approve/user-bank')
    @HttpCode(HttpStatus.OK)
    async getApprovedUsersBankInfo() {
        const profile = await this.userService.getApprovedUsersBankInfo();
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Approved Bank Info Users Fetched Successfully",
            payload: { profile }
        };
        return data
    }

}
