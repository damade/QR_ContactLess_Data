import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { OtpService } from 'src/core/utils/service/otp.service';
import { AdminUsersService } from 'src/modules/admin_users/admin.users.service';
import { AdminUserDto } from 'src/modules/admin_users/dto/admin.user.dto';
import { UserPasswordDto } from '../../users/dto/user.pin.dto';

@Injectable()
export class AdminAuthService {

    constructor(
        private readonly userService: AdminUsersService,
        private readonly jwtService: JwtService,
        private readonly cipherService: CipherService,
        private readonly appLogger: AppLogger,
        private readonly otpService: OtpService,
    ) { }

    async validateUser(phoneNumber: string, inputPassword: string, email: string, staffId: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByPhoneNumberOrEmailOrStaffId(phoneNumber, email, staffId);
        if (!user) {
            return null;
        }

        const userInJson =user.toJSON()

        // find if user password match
        const match = await this.cipherService.comparePassword(inputPassword, userInJson.password);
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, __v, bearerToken, ...result } = userInJson;

        return result;
    }

    public async login(user) {
        const { _id, phoneNumber, email, uniqueId } = user
        //Extracting relevant info for Bearer Token.
        const newUser = { _id, phoneNumber, email, uniqueId, isAdmin: true }
        const token = await this.generateToken(newUser);
        await this.userService.updateBearerToken(_id, token)
        const data: ApiData = { success: true, message: "Login Successful", payload: { user, token: `Bearer ${token}` } };
        return data;
    }

    public async logout(id: string) {
        await this.userService.updateBearerToken(id, null)
        const data: ApiData = { success: true, message: "Logout Successful" };
        return data;
    }

    public async createAdminUser(adminUserModel: AdminUserDto) {
        const otps = await this.otpService.getEmailOTP(adminUserModel.email)
        if (!(otps) || otps.length < 1) {
            throw new BadRequestException('Otp has not been verified.');
        }
        try {

            // create the user
            const newAdminUser = await this.userService.create(adminUserModel)

            const { password, bearerToken, ...result } = newAdminUser

            // // return the user and the token
            const data: ApiData = { success: true, message: "Admin Account Created Successfully", payload: { user: result } };
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    async resetPin(user: UserPasswordDto) {
        const userResult = await this.userService.findOneByEmail(user.email);
        if (!userResult) {
            throw new ForbiddenException('This email does not exist as a registered user');
        }
        // hash the password
        const pass = await this.cipherService.hashPassword(user.password);

        try {

            // create the user
            const newUser = await this.userService.updatePassword({ ...user, password: pass });

            if (!newUser) {
                return new HttpException("Password not Changed Successfully", HttpStatus.UNPROCESSABLE_ENTITY)
            }

            const data: ApiData = { success: true, message: "Password Changed Successfully", payload: {} }
            return data

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendOtp(phoneNumber: string, emailAddress: string, isLogin: boolean) {
        const user = await this.userService.findOneByPhoneNumberOrEmail(phoneNumber, emailAddress);
        if (user) {
            throw new ForbiddenException('This phone number or email exist as a registered user');
        }
        try {
            await this.otpService.sendAdminEmailOtp(phoneNumber, emailAddress, isLogin)
            const data: ApiData = { success: true, message: "OTP sent", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendForgottenPasswordOtp(emailAddress: string, isLogin: boolean) {
        const user = await this.userService.findOneByEmail(emailAddress);
        if (!user) {
            throw new ForbiddenException('This email does not exist as a registered user');
        }
        try {
            await this.otpService.sendAdminEmailOtp(user.phoneNumber, emailAddress, isLogin)
            const data: ApiData = { success: true, message: "OTP sent", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            await this.otpService.verifyOtp(email, otp)
            const data: ApiData = { success: true, message: "OTP verified successfully", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyEmailOtp(email: string, otp: string) {
        try {
            await this.otpService.verifyEmailOtp(email, otp)
            const data: ApiData = { success: true, message: "OTP verified successfully", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendOtpRegister(userRequest: AdminUserDto) {
        try {
            var errorMessage: string = ""
            const rPhoneNumber = await this.userService
                .findOneByParams({ phoneNumber: userRequest.phoneNumber });
            const rEmail = await this.userService
                .findOneByParams({ email: userRequest.email });
            if (rPhoneNumber) {
                errorMessage += 'This phone number exist as a registered user,';
            } if (rEmail) {
                errorMessage += 'This email exist as a registered user,';
            }
            if (errorMessage.length > 1 && errorMessage) {
                throw new ForbiddenException(errorMessage);
            }
            await this.otpService.sendAdminEmailOtp(userRequest.phoneNumber, userRequest.email, false)
            const data: ApiData = { success: true, message: "OTP sent", payload: {} }
            return data
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException(getErrorMessage(error))
            } else {
                throw new HttpException(getErrorMessage(error), HttpStatus.BAD_REQUEST)
            }
        }
    }
}
