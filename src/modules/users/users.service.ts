import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import mongoose from 'mongoose';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { MediaService } from 'src/core/utils/service/media.service';
import { UserDto } from './dto/user.dto';
import { UserPasswordDto } from './dto/user.pin.dto';
import { UserPasswordChangeDto } from './dto/user.pin.update.dto';
import { UsersDatabaseService } from './services/users.db.service';
import { IUser } from './model/user.entity';
import { mapToUser } from './mapper/user.mapper';
import { QrService } from 'src/core/utils/service/qr.service';
import { generateUniqueCode } from 'src/core/utils/helpers/string.helper';
import { AppLogger } from 'src/core/logger/logger';

@Injectable()
export class UsersService {

    constructor(private readonly userDB: UsersDatabaseService,
        private readonly mediaService: MediaService,
        private readonly cipherService: CipherService,
        private readonly qrService: QrService,
        private readonly appLogger: AppLogger,
        private readonly cipherSearchService: CipherSearchService) { }

    async create(signatureFile: Express.Multer.File, user: UserDto,
        isCreatingBvn: boolean, isCreatingAccount: boolean): Promise<IUser> {
        try {
            if (!signatureFile) {
                throw new HttpException("Please add your Image Of your Signature", HttpStatus.BAD_REQUEST);
            }

            // hash the password
            const hashPassword = await this.cipherService.hashPassword(user.password);

            var fileLink = await this.mediaService.uploadImage(signatureFile)
                .catch(
                    error => {
                        throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                    });
            return await this.userDB.createUser(mapToUser(
                {
                    ...user, signatureUrl: fileLink, password: hashPassword,
                    isCreatingAccount: isCreatingAccount, isCreatingBvn: isCreatingBvn
                }));
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createWithoutImage(user: UserDto, isCreatingBvn: boolean, isCreatingAccount: boolean): Promise<IUser> {
        try {

            // hash the password
            const hashPassword = await this.cipherService.hashPassword(user.password);
            return await this.userDB.createUser(mapToUser(
                {
                    ...user, password: hashPassword, isCreatingAccount: isCreatingAccount,
                    isCreatingBvn: isCreatingBvn, uniqueId: generateUniqueCode(10)
                }));
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUserProfile(idInput: string): Promise<any> {
        try {
            const userWithAdditionalFields = (await this.userDB.userWithAdditionalFields(new mongoose.Types.ObjectId(idInput)))[0]

            if (!userWithAdditionalFields) {
                throw new BadRequestException("User Profile Could Not Be Fetched")
            }

            return {
                _id: userWithAdditionalFields._id, user: userWithAdditionalFields.user[0],
                bvnInfo: userWithAdditionalFields.bvnInfo[0] ? userWithAdditionalFields.bvnInfo[0] : null,
                bankInfo: userWithAdditionalFields.bankInfo[0]
            }
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async updatePassword(user: UserPasswordDto): Promise<IUser> {
        try {
            const fetchedUser = await this.findOneByEmail(user.email);
            return await this.userDB.updateUser(
                {
                    query: { phoneNumber: fetchedUser.phoneNumber },
                    newData: { password: user.password },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async fetchUserQrData(userId: string): Promise<String> {
        try {
            const fetchedUser = await this.userDB.user(userId);

            const userQrUrl = this.qrService.generateUserQrToScan(fetchedUser)

            return userQrUrl
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async updateBearerToken(userId: string, bearerTokenInput: string): Promise<IUser> {
        try {
            const userIdObject = new mongoose.Types.ObjectId(userId)
            return await this.userDB.updateUser(
                {
                    query: { _id: userIdObject },
                    newData: { bearerToken: bearerTokenInput },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async changePassword(email: string, user: UserPasswordChangeDto) {
        try {
            const userResult = await this.findOneByEmail(email);
            if (!userResult) {
                throw new ForbiddenException('Something went wrong, imposter user');
            }

            const match = await this.cipherService.comparePassword(user.oldPassword, userResult.password);

            if (!match) {
                throw new UnprocessableEntityException("Old Pin is Incorrect")
            }

            // hash the password
            const newPassword = await this.cipherService.hashPassword(user.newPassword);

            await this.userDB.updateUserOnly(
                {
                    query: { phoneNumber: userResult.phoneNumber },
                    newData: {
                        password: newPassword,
                        bearerToken: null
                    },
                });

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByPhoneNumber(phoneNumberInput: string): Promise<IUser> {
        try {
            return await this.userDB.userByPhoneNumber(phoneNumberInput);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByEmail(email: string): Promise<IUser> {
        try { return await this.userDB.userByEmail(email) }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByParams(params): Promise<IUser> {
        try {
            return await this.userDB.checkUserByParams(params)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByPhoneNumberOrEmail(phoneNumber: string, email: string): Promise<IUser> {
        try {
            return await this.userDB.userByPhoneNumberOrEmail(phoneNumber, email)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneById(idInput: string): Promise<IUser> {
        try {
            return await this.userDB.userWithAdditionalFields(new mongoose.Types.ObjectId(idInput))
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByUserIdAdditional(idInput: string): Promise<any | null> {
        try {
            return await this.userDB.userWithAdditionalFields(new mongoose.Types.ObjectId(idInput))
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByUserId(idInput: string): Promise<any | null> {
        try {
            return await this.userDB.user(idInput)
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async getIdentificationList(): Promise<ENUMS[]> {
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
                },]

            return enumsValue;
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async approvedBankInfos(): Promise<IUser[] | null> {
        return await this.userDB.approvedBankInfos();
    }

    async unApprovedBankInfos(): Promise<IUser[] | null> {
        return await this.userDB.unApprovedBankInfos();
    }

    async approvedBvns(): Promise<IUser[] | null> {
        return await this.userDB.approvedBvns();
    }

    async unApprovedBvns(): Promise<IUser[] | null> {
        return await this.userDB.unApprovedBvns();
    }


    async updateApprovedAccountCreation(userId: string): Promise<IUser> {
        try {
            const userIdObject = new mongoose.Types.ObjectId(userId)
            return await this.userDB.updateUser(
                {
                    query: { _id: userIdObject },
                    newData: { hasAccountBeenApproved: true, hasBvnBeenApproved: true},
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
