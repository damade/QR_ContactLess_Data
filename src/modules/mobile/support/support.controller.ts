import { Controller, HttpCode, Request, Body, HttpStatus, Post, Get, Param } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { SupportDto } from './dto/support.dto';
import { SupportService } from './support.service';

@Controller('customer/support')
export class SupportController {

    constructor(private readonly supportService: SupportService,
        private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async addIssues(@Request() req, @Body() supportDto: SupportDto) {
        const id = req.user.id;
       const addedIssue = await this.supportService.createIssue(id, supportDto);
        this.appLogger.log(addedIssue)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Issue Added Successfully.",
            payload: addedIssue
        };
        return data
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getIssues(@Request() req) {
        const id = req.user.id;
        const issues = await this.supportService.getSupportInfos(id);
        this.appLogger.log(issues)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Support Information Fetched Successfully",
            payload: issues
        };
        return data
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getAnIssue(@Param('id') id: number) {
        const issues = await this.supportService.getSupportInfo(id);
        this.appLogger.log(issues)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "Support Information Fetched Successfully",
            payload: issues
        };
        return data
    }

    @Get('issue-category-list')
    @HttpCode(HttpStatus.OK)
    async getIssueCategoryList() {
        const issueCategoryList = await this.supportService.getIssueCategoryList();
        this.appLogger.log(issueCategoryList)

        // return Identification List
        const data: ApiData = { success: true, message: "Issue Category List Fetched Successfully",
         payload: issueCategoryList  };
        return data
    }
}
