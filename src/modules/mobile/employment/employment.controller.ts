import { Body, Controller, Get, HttpCode, Request, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { EmploymentDto } from './dto/employment.dto';
import { EmploymentUpdateDto } from './dto/employment.update.dto';
import { EmploymentService } from './employment.service';

@Controller('customer/employment-profile')
export class EmploymentController {
    constructor(private readonly employmentService: EmploymentService,
        private readonly appLogger: AppLogger) { }


    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async fillEmploymentProfile(@Request() req, @Body() employmentInput: EmploymentDto) {
        const customerId = req.user.id
        //const employment = await this.employmentService.createEmploymentProfile(customerId, employmentInput);
        const employment = await this.employmentService.createEmploymentProfileWithLoanEligibility(customerId, employmentInput);
        
         // return the user and the token
         const data: ApiData = { success: true, message: "Employment Profile Created Successfully",
         payload: employment };
        return data
    }

    @Put('')
    @HttpCode(HttpStatus.OK)
    async updateEmploymentProfile(@Request() req, @Body() employmentInput: EmploymentUpdateDto) {
        const updatedEmployment = await this.employmentService.updateEmploymentProfile(req.user.id, employmentInput);
        // return the user and the token
        const data: ApiData = { success: true, message: "Employment Profile Updated Successfully",
         payload:  updatedEmployment  };
        return data
    }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getEmploymentProfile(@Request() req) {
        const employmentProfile = await this.employmentService.getEmploymentProfile(req.user.id);
        this.appLogger.log(employmentProfile)
        // return the user employment profile
        const data: ApiData = { success: true, message: "Employment Profile Fetched Successfully",
         payload:  employmentProfile  };
        return data
    }

  
}
