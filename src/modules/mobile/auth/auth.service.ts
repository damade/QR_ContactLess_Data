import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { identity } from 'rxjs';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { ApiKeyGenerationService } from 'src/core/utils/service/api.key.gen.service';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { OtpService } from 'src/core/utils/service/otp.service';
import { ReferralCodeService } from 'src/core/utils/service/referral.code.service';
import { UserDto } from '../users/dto/user.dto';
import { UserPinDto } from '../users/dto/user.pin.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly cipherService: CipherService,
        private readonly appLogger: AppLogger,
        private readonly apiKeyFinder: ApiKeyGenerationService,
        private readonly cipherSearchService: CipherSearchService,
        private readonly otpService: OtpService,
        private readonly referralCodeService: ReferralCodeService
    ) { }

    // KEYS
    private apiKeys: string[] = [
        'eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJV',
        'c2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY0OTgyNT',
        'c2MywiaWF0IjoxNjQ5ODI1NzYzfQ',
        'gT5AHfXUV1zHtfvfBDw9rRlkW27OaomkboPYtko6M',
    ];

    validateApiKey(apiKey: string) {
        return this.apiKeys.find(apiK => apiKey === apiK);
    }

    // validateApiKey(apiKey: string) {
    //     return await this.apiKeyFinder.getApiKey .apiKeys.find(apiK => apiKey === apiK);
    // }

    async validateUser(phoneNumber: string, pinPass: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByPhoneNumber(phoneNumber);
        if (!user) {
            return null;
        }

        // find if user password match
        const match = await this.cipherService.comparePassword(pinPass, user.pin);
        if (!match) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { pin, bvn, bvnIndex, nin, ninIndex, bearerToken,  ...result } = user;

        return result;
    }

    public async login(user) {
        const { id, phoneNumber, email } = user
        //Extracting relevant info for Bearer Token.
        const newUser = { id, phoneNumber, email }
        const token = await this.generateToken(newUser);
        await this.userService.updateBearerToken(id, token)
        const data: ApiData = { success: true, message: "Login Successful", payload: { user, token: `Bearer ${token}` } };
        return data;
    }

    public async logout(id: number) {
        await this.userService.updateBearerToken(id, null)
        const data: ApiData = { success: true, message: "Logout Successful" };
        return data;
    }

    public async create(user: UserDto) {
        if(!(await this.otpService.getOTP(user.phoneNumber))){
            throw new BadRequestException('Otp has not been sent to the phone number');     
        }
        try {

            // hash the password
            const pass = await this.cipherService.hashPassword(user.pin);

            // //encrypt the nin and bvn for indexes
            const bvnIndexRequest = await this.cipherSearchService.getBVNIndex(user.bvn);

            // //encrypt the nin and bvn
             const encryptBvn = await this.cipherService.encryptWithAES(user.bvn);

            // //generate the referral code
             const genReferralCode = await this.referralCodeService.sendReferralCode();

            // // create the user
            const newUser = await this.userService.create({
                ...user, pin: pass, bvnIndex: bvnIndexRequest,
                bvn: encryptBvn, referralCode: genReferralCode
            });

            // tslint:disable-next-line: no-string-literal
            const { bvn, pin, bvnIndex, nin, ninIndex, ...result } = newUser;

            // // return the user and the token
            const data: ApiData = { success: true, message: "Account Created Successfully", payload: { user: result } };
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private async generateToken(user) {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    async resetPin(user: UserPinDto) {
        const userResult = await this.userService.findOneByEmail(user.email);
        if (!userResult) {
            throw new ForbiddenException('This email does not exist as a registered user');
        }
        // hash the password
        const pass = await this.cipherService.hashPassword(user.pin);

        try {

            // create the user
            const newUser = await this.userService.updatePin({ ...user, pin: pass });

            if (!newUser) {
                return new HttpException("Password not Changed Successfully", HttpStatus.UNPROCESSABLE_ENTITY)
            }

            const data: ApiData = { success: true, message: "Password Changed Successfully", payload: {} }
            return data

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendOtp(phoneNumber: string, emailAddress: string) {
        const user = await this.userService.findOneByPhoneNumberOrEmail(phoneNumber, emailAddress);
        if (user) {
            throw new ForbiddenException('This phone number or email exist as a registered user');
        }
        try {
            await this.otpService.sendOtp(phoneNumber, emailAddress)
            const data: ApiData = { success: true, message: "OTP sent", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendOtpRegister(userRequest: UserDto) {
        try {
            var errorMessage: string = ""
            const rPhoneNumber = await this.userService
                .findOneByParams({ phoneNumber: userRequest.phoneNumber });
            const rBvn = await this.userService
                .findOneByBvn(userRequest.bvn);
            const rEmail = await this.userService
                .findOneByParams({ email: userRequest.email });    
            if (rPhoneNumber) {
                errorMessage += 'This phone number exist as a registered user,';
            } if (rBvn) {
                errorMessage += 'This bvn exist as a registered user,';
            } if (rEmail) {
                errorMessage += 'This email exist as a registered user,';
            }
            if (errorMessage.length > 1 && errorMessage) {
                throw new ForbiddenException(errorMessage);
            }
            await this.otpService.sendOtp(userRequest.phoneNumber, userRequest.email)
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

    async sendForgottenPasswordOtp(emailAddress: string) {
        const user = await this.userService.findOneByEmail(emailAddress);
        if (!user) {
            throw new ForbiddenException('This email does not exist as a registered user');
        }
        try {
            await this.otpService.sendEmailOtp(user.phoneNumber, emailAddress)
            const data: ApiData = { success: true, message: "OTP sent", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyOtp(mobileNumber: string, otp: string) {
        try {
            await this.otpService.verifyOtp(mobileNumber, otp)
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

    async getReferralList(): Promise<ENUMS[]> {
        try {
            const enumsValue: ENUMS[] =
                [{
                    name: "Friend",
                    value: "Friend"
                }, {
                    name: "Twitter",
                    value: "Twitter"
                }, {
                    name: "WhatsApp",
                    value: "WhatsApp"
                }, {
                    name: "Instagram",
                    value: "Instagram"
                }, {
                    name: "Facebook",
                    value: "Facebook"
                }, {
                    name: "Others",
                    value: "Others"
                }, {
                    name: "Family",
                    value: "Family"
                }, {
                    name: "None",
                    value: "None"
                },{
                    name: "Google",
                    value: "Google"
                }, {
                    name: "Linkedln",
                    value: "Linkedln"
                },]

            return enumsValue;
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }
}
