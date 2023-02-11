import { Controller, Body, Post, HttpCode, HttpStatus, Patch, ParseFilePipeBuilder, UploadedFile, Query, Get, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/core/decorators/public.decorator';
import { AddressDto } from '../users/dto/address.dto';
import { UserVerifyDto } from '../users/dto/user.verify.dto';
import { OtpRequestDto } from './dto/otp.dto';
import { OtpEmailDto } from './dto/otp.email.verify.dto';
import { VerifyDto } from './dto/verify.dto';
import { VerifyService } from './verify.service';

@Controller('customer')
@Public()
export class VerificationController {
    constructor(private verifyService: VerifyService) { }


    @Get('fetch-lg')
    @HttpCode(HttpStatus.OK)
    fetchLg(@Query('state') state: string) {
        return this.verifyService.fetchLg(state);
    }

    @Get('identification-list')
    @HttpCode(HttpStatus.OK)
    fetchIdentificationList() {
        return this.verifyService.getIdentificationList();
    }

    @UseInterceptors(FileInterceptor('signatureImage'))
    @Post('verify/user-details')
    @HttpCode(HttpStatus.OK)
    async verifyUserDetails(@UploadedFile(
        new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: 2500000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) signatureImage: Express.Multer.File, @Body() userVerifyDto: UserVerifyDto) {
        return await this.verifyService.verifyUserDetails(signatureImage, userVerifyDto);
    }

    @UseInterceptors(FileInterceptor('identityImage'))
    @Post('verify/user-bankinfo')
    @HttpCode(HttpStatus.CREATED)
    async verifyUserBankInfo(@UploadedFile(
        new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: 2500000
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
    ) identityImage: Express.Multer.File, @Body() userVerifyDto: VerifyDto) {
        return await this.verifyService.verifyUserDetailsAndBankInfo(identityImage, userVerifyDto);
    }

    @Post('verify/user-address')
    @HttpCode(HttpStatus.OK)
    verifyUserAddress(@Body() addressDto: AddressDto) {
        return this.verifyService.verifyUserAddress(addressDto);
    }

    @Post('verify/otp')
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() otpVerifyReq: OtpEmailDto) {
        return await this.verifyService.verifyOtp(otpVerifyReq.email, otpVerifyReq.otp);
    }
    
    @Post('verify/resend-otp')
    @HttpCode(HttpStatus.CREATED)
    async resendOtp(@Body() otpReq: OtpRequestDto) {
        return await this.verifyService.sendOtp(otpReq.phoneNumber, otpReq.email);
    }
}
