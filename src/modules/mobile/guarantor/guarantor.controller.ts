import { Body, Controller, Get, HttpCode, Request, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { GuarantorDto } from './dto/guarantor.dto';
import { GuarantorUpdateDto } from './dto/guarantor.update.dto';
import { GuarantorService } from './guarantor.service';

@Controller('customer/guarantor')
export class GuarantorController {
    
    constructor(private readonly guarantorService: GuarantorService,
        private readonly appLogger: AppLogger) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async fillGuarantorInfo(@Request() req, @Body() guarantorInput: GuarantorDto) {
        const customerId = req.user.id
        // const guarantor = await this.guarantorService.createGuarantor(customerId, guarantorInput);
        const loanEligibility = await this.guarantorService.createGuarantorWithLoanEligibility(customerId, guarantorInput);
        this.appLogger.log(loanEligibility)

         // return the guarantor info saved
         const data: ApiData = { success: true, message: "Guarantor Profile Created Successfully",
         payload: loanEligibility };
        return data
    }

    @Put('')
    @HttpCode(HttpStatus.OK)
    async updateEmploymentProfile(@Request() req, @Body() guarantorInput: GuarantorUpdateDto) {
        const customerId = req.user.id
        const updatedGuarantor = await this.guarantorService.updateGuarantor(customerId, guarantorInput);
        // return the guarantor info updated
        const data: ApiData = { success: true, message: "Guarantor Profile Updated Successfully",
         payload: updatedGuarantor };
        return data
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getEmploymentProfile(@Request() req) {
        const customerId = req.user.id
        const guarantorInfo = await this.guarantorService.getGuarantor(customerId);
        this.appLogger.log(guarantorInfo)
        // return the guarantor info fetched
        const data: ApiData = { success: true, message: "Guarantor Profile Fetched Successfully",
         payload: guarantorInfo };
        return data
    }

  
}
