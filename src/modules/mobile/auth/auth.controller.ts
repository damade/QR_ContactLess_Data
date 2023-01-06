import { Controller, Get, UseGuards, Body, Post, Request, HttpCode, HttpStatus, Patch, Req } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { LocalAuthGuard } from 'src/core/guards/local.auth.guard';
import { ApiData } from 'src/core/model/api.data';
import { UserDto } from '../users/dto/user.dto';
import { UserPinDto } from '../users/dto/user.pin.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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


    @UseGuards(DoesUserExist)
    @Post('register')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Request() req) {
        return await this.authService.logout(req.user.id);
    }

    @Patch('forgot-pin')
    async resetPin(@Body() user: UserPinDto) {
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

    @Post(['forgot-pin/send-otp','send-otp'])
    @HttpCode(HttpStatus.CREATED)
    async sendForgottenPasswordOtp(@Body() otpReq: OtpEmailRequestDto) {
        return await this.authService.sendForgottenPasswordOtp(otpReq.email);
    }

    @Post(['forgot-pin/verify-otp','verify-otp'])
    @HttpCode(HttpStatus.CREATED)
    async verifyForgottenPasswordOtp(@Body() otpVerifyReq: OtpEmailDto) {
        return await this.authService.verifyEmailOtp(otpVerifyReq.email, otpVerifyReq.otp);
    }

    @Get('referral-list')
    @HttpCode(HttpStatus.OK)
    async getReferralList() {
        const referralList = await this.authService.getReferralList();
        
        //return Referral List
        const data: ApiData = { success: true, message: "Referral List Fetched Successfully",
         payload: referralList  };
        return data
    }
}
