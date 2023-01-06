import { Controller, Post, Request, HttpCode, HttpStatus, Body, Put, Patch, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BusinessService } from './business.service';
import { BusinessProfileDto } from './dto/business.profile.dto';
import { BusinessProfileUpdateDto } from './dto/business.profile.update.dto';

@Controller('customer/business-profile')
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService,
        private readonly appLogger: AppLogger
    ) { }


    @UseInterceptors(FileInterceptor('cacFile'))
    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async fillBusinessProfile(@UploadedFile() cacFile: Express.Multer.File,
    @Request() req, @Body() businessProfileInput: BusinessProfileDto) {
        const customerId = req.user.id
        //const employment = await this.employmentService.createEmploymentProfile(customerId, employmentInput);
        const businessProfile = await this.businessService.createBusinessProfileWithLoanEligibility(customerId, cacFile, businessProfileInput);
        
         // return the newly created business profile
         const data: ApiData = { success: true, message: "Business Profile Created Successfully",
         payload: businessProfile };
        return data
    }

    @Patch('update')
    async updateBusinessProfile(@Body() businessProfileInput: BusinessProfileUpdateDto, @Request() req) {
        const updatedBusinessProfile = await this.businessService.updateBusinessProfile(req.user.id, businessProfileInput);
        
        // return the updated user business profile 
        const data: ApiData = {
            success: true, message: "Business Profile Updated Successfully",
            payload: updatedBusinessProfile
        };
        return data
    }

    @UseInterceptors(FileInterceptor('cacFile'))
    @Patch('update-cac')
    @HttpCode(HttpStatus.CREATED)
    async updateBusinessProfileWithPicture(@UploadedFile() cacFile: Express.Multer.File,
        @Body() businessProfileInput: BusinessProfileDto, @Request() req) {
        const updatedBusinessProfile = await this.businessService.updateBusinessProfileWithCacFile
        (req.user.id, cacFile, businessProfileInput);
        
        // return the updated user business profile 
        const data: ApiData = {
            success: true, message: "Business Profile Updated Successfully",
            payload: updatedBusinessProfile
        };
        return data
    }


    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getBusinessProfile(@Request() req) {
        const businessProfile = await this.businessService.getBusinessProfile(req.user.id);
        this.appLogger.log(businessProfile)
        // return the user business profile
        const data: ApiData = { success: true, message: "Business Profile Fetched Successfully",
         payload: businessProfile } ;
        return data
    }

    @Get('business-sector-list')
    @HttpCode(HttpStatus.OK)
    async getBusinessSectorList() {
        const businessSectorList = await this.businessService.getBusinessSectors();
        this.appLogger.log(businessSectorList)

        // return Business sector List
        const data: ApiData = { success: true, message: "Business Sector List Fetched Successfully",
         payload: businessSectorList  };
        return data
    }
}
