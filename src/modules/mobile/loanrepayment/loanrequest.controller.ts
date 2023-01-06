import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, ParseFilePipeBuilder, Post, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { RepaymentByTransferDto } from './dto/repaymentbytransfer.dto';
import { LoanRepaymentByTransferService } from './provider/repaymentbytransfer.service';

@Controller('customer/loanrepayment')
export class LoanRepaymentController {

    constructor(
        private readonly loanRepaymentByTransferService : LoanRepaymentByTransferService,
        private readonly appLogger: AppLogger) { }

    
    @UseInterceptors(FileInterceptor('proof'))
    @Post('transfer')
    @HttpCode(HttpStatus.OK)
    async payRepaymentByTransfer(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'jpeg' || 'jpg' || 'png',
                })
                .addMaxSizeValidator({
                    maxSize: 2500
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) proof: Express.Multer.File,
        @Request() req,@Body() loanRepaymentInput: RepaymentByTransferDto) {
        
        const userId = req.user.id
       
        const repaymentEntry = await this.loanRepaymentByTransferService.addLoanRepaymentByTransfer(userId, proof, loanRepaymentInput)
         
        // return the user business profile
        const data: ApiData = { success: true,
             message: "Your loan request has been sent successfully and will be disbursed in few minutes.",
         payload: repaymentEntry } ;
        return data
    }


}
