import { Controller, HttpCode, Request, Body, HttpStatus, Post, Get, Param, Patch } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { SupportUpdateDto } from './dto/support.update.dto';
import { SupportService } from './support.service';

@Controller('web/support')
export class SupportController {
    constructor(private readonly supportService: SupportService,
        private readonly appLogger: AppLogger) { }

    @Patch('update')
    @HttpCode(HttpStatus.CREATED)
    async addIssues(@Body() supportDto: SupportUpdateDto) {
        const updatedIssue = await this.supportService.updateSupport(supportDto);
        this.appLogger.log(updatedIssue)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Issues Updated Successfully.",
            payload: updatedIssue
        };
        return data
    }

    @Get('user/:id')
    @HttpCode(HttpStatus.OK)
    async getIssuesByUserId(@Param('id') id: string) {
        const issues = await this.supportService.getSupportInfosByUserId(id);
        this.appLogger.log(issues)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Support Information Fetched Successfully",
            payload: issues
        };
        return data
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    async getAllIssues() {
        const issues = await this.supportService.getSupportInfos();
        this.appLogger.log(issues)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Support Information Fetched Successfully",
            payload: issues
        };
        return data
    }

    @Get('all/:id')
    @HttpCode(HttpStatus.OK)
    async getIssueById(@Param('id') id: string) {
        const issue = await this.supportService.getSupportInfo(id);
        this.appLogger.log(issue)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Support Information Fetched Successfully",
            payload: issue
        };
        return data
    }

    @Get('issue-resolution-list')
    @HttpCode(HttpStatus.OK)
    async getIssueResolutionList() {
        const resolutionList = await this.supportService.getIssueResolutionList();
        this.appLogger.log(resolutionList)

        // return Identification List
        const data: ApiData = { success: true, message: "Issue Resolution List Fetched Successfully",
         payload: resolutionList  };
        return data
    }

}
