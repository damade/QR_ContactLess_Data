import { ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { STATE, stateLg } from 'src/core/constants';
import { AppLogger } from 'src/core/logger/logger';
import { ApiData } from 'src/core/model/api.data';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { MediaService } from 'src/core/utils/service/media.service';
import { OtpService } from 'src/core/utils/service/otp.service';
import { BankAccountService } from '../bankaccount/bank.account.service';
import { AddressDto } from '../users/dto/address.dto';
import { UserVerifyDto } from '../users/dto/user.verify.dto';
import { UsersService } from '../users/users.service';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class VerifyService {

    constructor(
        private readonly userService: UsersService,
        private readonly bankAccountService: BankAccountService,
        private readonly otpService: OtpService,
        private readonly appLogger: AppLogger,
        private readonly mediaService: MediaService) { }


    fetchLg(state: string): ApiData {
        if (!state || state.isEmptyOrNull()) {
            throw new UnprocessableEntityException("State query can not be empty");
        }
        const lga = stateLg.find(states => states.state.toLowerCase() === state.toLowerCase() || states.alias === state.toLowerCase());
        if (lga) {
            return { success: true, message: `Local Government Fetched successfully for ${state}`, payload: { lg: lga.lgas } }
        } else {
            throw new UnprocessableEntityException("State entered can not be found");
        }

    }

    async verifyUserDetails(signatureImage: Express.Multer.File, userVerifyDto: UserVerifyDto): Promise<ApiData> {
        const userExist = await this.userService.findOneByPhoneNumberOrEmail(userVerifyDto.phoneNumber,
            userVerifyDto.email);
        if (userExist) {
            throw new ForbiddenException('This user already has an account via the email or phone number, you can not create an account anymore');
        }
        if (!signatureImage) {
            throw new HttpException("Please add the image of your signature", HttpStatus.BAD_REQUEST);
        }
        const data: ApiData = { success: true, message: "Data Verified successfully", payload: userVerifyDto }
        return data

    }

    verifyUserAddress(addressDto: AddressDto): ApiData {
        try {
            const data: ApiData = { success: true, message: "Address Verified successfully", payload: addressDto }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyUserDetailsAndBankInfo(profileImage: Express.Multer.File, userVerifyDto: VerifyDto): Promise<ApiData> {
        try {
            const userExist = await this.userService.findOneByPhoneNumberOrEmail(userVerifyDto.phoneNumber,
                userVerifyDto.email);
            if (userExist) {
                throw new ForbiddenException('This user already has an account via the email or phone number, you can not create an account anymore');
            }
            if (!profileImage) {
                throw new HttpException("Please add your image for Identity", HttpStatus.BAD_REQUEST);
            }
            if (userVerifyDto.isCreatingBvn == false) {
                const bvnExist = await this.bankAccountService.findOneByBvn(userVerifyDto.bvn)
                if (bvnExist) {
                    throw new ForbiddenException('This BVN has been used, kindly confirm the BVN.');
                }
            }
            const ninExist = await this.bankAccountService.findOneByNin(userVerifyDto.nin)
            if (ninExist) {
                throw new ForbiddenException('This NIN has been used, kindly confirm the NIN.');
            }
            await this.otpService.sendEmailOtp(userVerifyDto.phoneNumber, userVerifyDto.email)
            const data: ApiData = { success: true, message: "Data Verified successfully and Otp has been sent", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyOtp(email: string, otp: string): Promise<ApiData> {
        try {
            await this.otpService.verifyEmailOtp(email, otp)
            const data: ApiData = { success: true, message: "OTP verified successfully", payload: {} }
            return data
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sendOtp(phoneNumber: string, emailAddress: string): Promise<ApiData> {
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

    getIdentificationList(): ApiData {
        try {
            const enumsValue: ENUMS[] =
                [{
                    name: "NIN",
                    value: "NIN"
                }, {
                    name: "DRIVERSLICENSE",
                    value: "Drivers License"
                }, {
                    name: "INTERNATIONALPASSPORT",
                    value: "International Passport"
                }, {
                    name: "VOTERSCARD",
                    value: "Voters Card"
                }, {
                    name: "OTHERS",
                    value: "Others"
                }]

            const data: ApiData = { success: true, message: "OTP sent", payload: { identificationList: enumsValue } }
            return data;
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }


    async uploadImages(signatureFile: Express.Multer.File, profileImage: Express.Multer.File): Promise<any> {

        // Check if profile image file is empty
        if (!profileImage) {
            throw new HttpException("Please add your image for Identity", HttpStatus.BAD_REQUEST);
        }

        if (!signatureFile) {
            throw new HttpException("Please add your image for Signature", HttpStatus.BAD_REQUEST);
        }


        return await this.mediaService.uploadImage(profileImage)
            .then(async (profileImageLink: string) => {
                const signatureImageLink = await this.mediaService.uploadImage(signatureFile)
                    .catch(async (error) => {
                            await this.mediaService.deleteImage(profileImageLink)
                            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                        });
                const data: ApiData = {
                    success: true, message: "Signature and Profile Image Uploaded Successfully",
                    payload: {
                        profileImageLink, signatureImageLink
                    }
                }
                return data;
            })
            .catch(async (error) => {
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

}
