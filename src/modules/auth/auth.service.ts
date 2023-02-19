import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { BvnCreationData } from 'src/core/model/util.data';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { isNotMediaLink } from 'src/core/utils/helpers/media.helper';
import { genericExclude } from 'src/core/utils/helpers/prisma.helper';
import { ApiKeyGenerationService } from 'src/core/utils/service/api.key.gen.service';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { OtpService } from 'src/core/utils/service/otp.service';
import { ReferralCodeService } from 'src/core/utils/service/referral.code.service';
import { BankAccountService } from '../bankaccount/bank.account.service';
import { BankProfileDto } from '../bankaccount/dto/bank.account.dto';
import { BvnService } from '../bvn/bvn.service';
import { BvnDto } from '../bvn/dto/bvn.dto';
import { IBvn } from '../bvn/model/bvn.entity';
import { UserDto } from '../users/dto/user.dto';
import { UserPasswordDto } from '../users/dto/user.pin.dto';
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
        private readonly bvnService: BvnService,
        private readonly bankAccountService: BankAccountService,
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

    async validateUser(phoneNumber: string, inputPassword: string, email: string) {
        // find if user exist with this email
        const user = await this.userService.findOneByPhoneNumberOrEmail(phoneNumber, email);
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
        const newUser = { _id, phoneNumber, email, uniqueId }
        const token = await this.generateToken(newUser);
        await this.userService.updateBearerToken(_id, token)
        const data: ApiData = { success: true, message: "Login Successful", payload: { user, token: `Bearer ${token}` } };
        return data;
    }

    public async loginFullInfo(user) {
        const { _id, phoneNumber, email, uniqueId } = user
        //Extracting relevant info for Bearer Token.
        const newUser = { _id, phoneNumber, email, uniqueId }
        const token = await this.generateToken(newUser);
        await this.userService.updateBearerToken(_id, token)
        const fullUserInfo = await this.userService.getUserProfile(_id)
        const data: ApiData = { success: true, message: "Login Successful", payload: { userInfo: fullUserInfo, token: `Bearer ${token}` } };
        return data;
    }

    public async logout(id: string) {
        await this.userService.updateBearerToken(id, null)
        const data: ApiData = { success: true, message: "Logout Successful" };
        return data;
    }

    public async createBvnUser(identityFile: Express.Multer.File, signatureFile: Express.Multer.File, bvnModel: BvnDto) {
        const userInput = bvnModel.bankProfile.user
        const otps = await this.otpService.getEmailOTP(userInput.email)
        if (!(otps) || otps.length < 1) {
            throw new BadRequestException('Otp has not been sent to the Email');
        }
        try {

            // create the user
            const newUser = await this.bvnService.create(signatureFile, bvnModel)
                .then(async (userBvn: IBvn) => {
                    return await this.bankAccountService.createBankAccountOnly(
                        identityFile,
                        bvnModel.bankProfile,
                        userBvn.userId,
                        userBvn.bvn
                    );
                });

            // tslint:disable-next-line: no-string-literal
            const { bvn, bvnIndex, nin, ninIndex, taxIdentificationNumber, ...result } = newUser

            // // return the user and the token
            const data: ApiData = { success: true, message: "Account Created Successfully, kindly got to your nearest bank for approval", payload: { user: result } };
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async createBankAccount(
        identityFile: Express.Multer.File,
        signatureFile: Express.Multer.File, bankaccountModel: BankProfileDto) {

        const otps = await this.otpService.getEmailOTP(bankaccountModel.user.email)

        if (!(otps) || otps.length < 1) {
            throw new BadRequestException('Otp has not been sent to the Email');
        }
        try {

            // create the user
            const newUser = await this.bankAccountService.create(signatureFile, identityFile, bankaccountModel);


            const { bvn, bvnIndex, nin, ninIndex, taxIdentificationNumber, ...result } = newUser

            // // return the user and the token
            const data: ApiData = { success: true, message: "Bank Account Created Successfully, kindly got to your nearest bank for approval", payload: { user: result } };
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async createBvnUserWithoutImage(bvnModel: BvnDto) {
        const userInput = bvnModel.bankProfile.user
        const otps = await this.otpService.getEmailOTP(userInput.email)
        if (!(otps) || otps.length < 1) {
            throw new BadRequestException('Otp has not been sent or verified via email');
        }
        if (isNotMediaLink(bvnModel.bankProfile.userImage) || isNotMediaLink(userInput.signatureUrl)) {
            throw new HttpException("Please add your image for Identity or Signature", HttpStatus.BAD_REQUEST);
        }
        if (bvnModel.bankProfile.isCreatingBvn == false) {
            throw new HttpException("You need to create a BVN, just so you know.", HttpStatus.BAD_REQUEST);
        }
        try {
            // create the user
            const newUser = await this.bvnService.createWithoutImage(bvnModel)
                .then(async (userBvnInfo: BvnCreationData) => {
                  const createBankAccount =  await this.bankAccountService.createBankAccountOnlyWithoutImage(
                        bvnModel.bankProfile,
                        userBvnInfo.user._id,
                        userBvnInfo.bvnInfo.bvn
                    );
                    return {user: userBvnInfo.user, bankInfo: createBankAccount["_doc"], bvnInfo: userBvnInfo.bvnInfo}
                });

            // extract info not needed
            const { bvn, bvnIndex, nin, userId, _id, __v, ninIndex, taxIdentificationNumber, ...result } = newUser.bankInfo

            // // return the user and the token
            const data: ApiData = { success: true, message: "Account Created Successfully, kindly got to your nearest bank for approval",
             payload: { user: newUser.user, bankInfo: result, bvnInfo: genericExclude(newUser.bvnInfo, "userId","_id","__v") } };
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    public async createBankAccountWithoutImage(bankaccountModel: BankProfileDto) {
        const otps = await this.otpService.getEmailOTP(bankaccountModel.user.email)
        if (!(otps) || otps.length < 1) {
            throw new BadRequestException('Otp has not been sent or verified via email');
        }

        if (isNotMediaLink(bankaccountModel.userImage) || isNotMediaLink(bankaccountModel.user.signatureUrl)) {
            throw new HttpException("Please add your image for Identity or Signature", HttpStatus.BAD_REQUEST);
        }

        try {

            // create the user
            const newUser = await this.bankAccountService.createWithoutImage(bankaccountModel);

            const { bvn, bvnIndex, nin, userId, ninIndex, taxIdentificationNumber, ...bankInfoResult } = newUser.bankInfo

            // // return the user and the token
            const data: ApiData = { success: true, message: "Bank Account Created Successfully, kindly got to your nearest bank for approval",
             payload: { user: newUser.user, bankInfo: bankInfoResult } };
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

    async sendOtp(phoneNumber: string, emailAddress: string) {
        const user = await this.userService.findOneByPhoneNumberOrEmail(phoneNumber, emailAddress);
        if (user) {
            throw new ForbiddenException('This phone number or email exist as a registered user');
        }
        try {
            await this.otpService.sendEmailOtp(phoneNumber, emailAddress)
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
}
