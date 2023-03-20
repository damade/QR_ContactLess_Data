import { Controller, Request, HttpCode, HttpStatus, Get, Delete, Patch, UploadedFile, ParseFilePipeBuilder, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BankAccountService } from './bank.account.service';

@Controller('customer/bank-info')
export class BankAccountController {
    constructor(
        private readonly bankAccountService: BankAccountService,
        private readonly appLogger: AppLogger
    ) { }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req) {
        const bankInfo = await this.bankAccountService.findOneById(req.user._id);
        this.appLogger.log(bankInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bank Info Fetched Successfully",
            payload: { bvnInfo: bankInfo }
        };
        return data
    }

    @UseInterceptors(FileInterceptor('identityImage'))
    @Patch('upload-image')
    @HttpCode(HttpStatus.OK)
    async uploadProfileImage(@UploadedFile(
        new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: 45500000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) identityImage: Express.Multer.File, @Request() req) {
        const bankInfo = await this.bankAccountService.updateProfileImage(identityImage, req.user._id);
        // return the user updated info
        const data: ApiData = {
            success: true, message: "User Profile Image Has Been Updated Successfully",
            payload: { bankInfo }
        };
        return data
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async deleteBvnInfo(@Request() req) {
        const bvnInfo = await this.bankAccountService.deleteOneById(req.user.id);
        this.appLogger.log(bvnInfo)
        // return the user and the token
        const data: ApiData = {
            success: true, message: "User Bank Info Deleted Successfully",
            payload: { bvnInfo }
        };
        return data
    }


}
