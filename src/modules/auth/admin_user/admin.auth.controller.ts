import { Controller, UseGuards, Body, Post, Request, HttpCode, HttpStatus, Patch, Req } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { AdminAuthGuard } from 'src/core/guards/admin.auth.guard';
import { DoesAdminUserExist } from 'src/core/guards/doesAdminUserExist.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt.auth.guard';
import { AdminUserDto } from 'src/modules/admin_users/dto/admin.user.dto';
import { UserPasswordDto } from '../../users/dto/user.pin.dto';
import { AdminPasswordRequestDto } from '../dto/admin.user.info.dto';
import { OtpRequestDto } from '../dto/otp.dto';
import { OtpEmailRequestDto } from '../dto/otp.email.dto';
import { OtpEmailDto } from '../dto/otp.email.verify.dto';
import { AdminAuthService } from './admin.auth.service';

@Controller('admin/auth')
@Public()
export class AdminAuthController {
    constructor(private authService: AdminAuthService) { }


    @UseGuards(AdminAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(DoesAdminUserExist)
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async signUpBvnJson(@Body() adminUser: AdminUserDto) {
        return await this.authService.createAdminUser(adminUser);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Request() req) {
        return await this.authService.logout(req.user._id);
    }

    @Patch('forgot-password')
    async resetPin(@Body() user: UserPasswordDto) {
        return await this.authService.resetPin(user);
    }

    @Post('register/send-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendOtp(@Body() otpReq: AdminUserDto) {
        return await this.authService.sendOtpRegister(otpReq);
    }

    @Post('sendonly-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendOnlyOtp(@Body() otpReq: OtpRequestDto) {
        return await this.authService.sendOtp(otpReq.phoneNumber, otpReq.email, false);
    }

    @Post('register/resend-otp')
    @HttpCode(HttpStatus.CREATED)
    async resendOtp(@Body() otpReq: OtpRequestDto) {
        return await this.authService.sendOtp(otpReq.phoneNumber, otpReq.email, false);
    }

    @Post('register/verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifyOtp(@Body() otpVerifyReq: OtpEmailDto) {
        return await this.authService.verifyEmailOtp(otpVerifyReq.email, otpVerifyReq.otp);
    }

    @Post('send-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendLoginOtp(@Body() otpReq: OtpEmailRequestDto) {
        return await this.authService.sendLoginOtp(otpReq.email, true);
    }

    @Post('forgot-password/send-otp')
    @HttpCode(HttpStatus.CREATED)
    async sendForgottenPasswordOtp(@Body() otpReq: AdminPasswordRequestDto) {
        return await this.authService.sendForgottenPasswordOtp(otpReq);
    }

    @Post(['forgot-password/verify-otp', 'verify-otp'])
    @HttpCode(HttpStatus.CREATED)
    async verifyForgottenPasswordOtp(@Body() otpVerifyReq: OtpEmailDto) {
        return await this.authService.verifyEmailOtp(otpVerifyReq.email, otpVerifyReq.otp);
    }
}
