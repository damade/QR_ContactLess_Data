import { Controller, Get, UseGuards, Body, Post, Request, HttpCode, HttpStatus, Patch, Req, ParseFilePipeBuilder, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/core/decorators/public.decorator';
import { DoesUserExistForBvn } from 'src/core/guards/doesUserExist.guard';
import { DoesUserExistForAccount } from 'src/core/guards/doesUserExistUS.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { LocalAuthGuard } from 'src/core/guards/local.auth.guard';
import { ApiData } from 'src/core/model/api.data';
import { BankProfileDto } from '../bankaccount/dto/bank.account.dto';
import { BvnDto } from '../bvn/dto/bvn.dto';
import { UserDto } from '../users/dto/user.dto';
import { UserPasswordDto } from '../users/dto/user.pin.dto';
import { AuthService } from './auth.service';
import { OtpRequestDto } from './dto/otp.dto';
import { OtpEmailRequestDto } from './dto/otp.email.dto';
import { OtpEmailDto } from './dto/otp.email.verify.dto';
import { OtpDto } from './dto/otp.verify.dto';

@Controller('customer/auth')
@Public()
export class AuthController {
    constructor(private authService: AuthService) { }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return await this.authService.login(req.user);
    }


    @UseGuards(DoesUserExistForBvn)
    @Post('register-bvn')
    async signUpBVn(
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
        ) signatureImage: Express.Multer.File,
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
        ) identityImage: Express.Multer.File,
        @Body() userBVn: BvnDto) {

        return await this.authService.createBvnUser(identityImage, signatureImage, userBVn);
    }


    @UseGuards(DoesUserExistForAccount)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'identityFile', maxCount: 1 },
        { name: 'signature', maxCount: 1 },
    ]))
    @Post('register-account')
    async signUpBankAccount(
        @UploadedFiles() files: { identityFile?: Express.Multer.File, signature?: Express.Multer.File },
        @Body() userProfile: BankProfileDto) {

        return await this.authService.createBankAccount(files.identityFile, files.signature, userProfile);
    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Request() req) {
        return await this.authService.logout(req.user.id);
    }

    @Patch('forgot-pin')
    async resetPin(@Body() user: UserPasswordDto) {
        return await this.authService.resetPin(user);
    }

    @Post('register/send-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendOtp(@Body() otpReq: UserDto) {
        return await this.authService.sendOtpRegister(otpReq);
    }

    @Post('sendonly-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendOnlyOtp(@Body() otpReq: OtpRequestDto) {
        return await this.authService.sendOtp(otpReq.phoneNumber, otpReq.email);
    }

    @Post('register/resend-otp')
    @HttpCode(HttpStatus.CREATED)
    async resendOtp(@Body() otpReq: OtpRequestDto) {
        return await this.authService.sendOtp(otpReq.phoneNumber, otpReq.email);
    }

    @Post('register/verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifyOtp(@Body() otpVerifyReq: OtpDto) {
        return await this.authService.verifyOtp(otpVerifyReq.phoneNumber, otpVerifyReq.otp);
    }

    @Post(['forgot-pin/send-otp', 'send-otp'])
    @HttpCode(HttpStatus.CREATED)
    async sendForgottenPasswordOtp(@Body() otpReq: OtpEmailRequestDto) {
        return await this.authService.sendForgottenPasswordOtp(otpReq.email);
    }

    @Post(['forgot-pin/verify-otp', 'verify-otp'])
    @HttpCode(HttpStatus.CREATED)
    async verifyForgottenPasswordOtp(@Body() otpVerifyReq: OtpEmailDto) {
        return await this.authService.verifyEmailOtp(otpVerifyReq.email, otpVerifyReq.otp);
    }

    @Get('referral-list')
    @HttpCode(HttpStatus.OK)
    async getReferralList() {
        const referralList = await this.authService.getReferralList();

        //return Referral List
        const data: ApiData = {
            success: true, message: "Referral List Fetched Successfully",
            payload: referralList
        };
        return data
    }
}
