import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { User, Gender, MaritalStatus, Role, ReferralSurvey, LoanEligibilityIssue, IdentificationType, LoanEligibility, AddressInfo, LoanTier, CreditScoreRate, EmploymentProfile, Guarantor } from '@prisma/client';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { CreditScoreService } from 'src/core/utils/service/credit.score.service';
import { MediaService } from 'src/core/utils/service/media.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { UserDto } from './dto/user.dto';
import { UserInfoDto } from './dto/user.info.dto';
import { UserPinDto } from './dto/user.pin.dto';
import { UserPinChangeDto } from './dto/user.pin.update.dto';
import { UserUpdateInfoDto } from './dto/user.update.info.dto';
import { UsersPrismaService } from './services/users.prisma.service';

@Injectable()
export class UsersService {

    constructor(private readonly userPrisma: UsersPrismaService,
        private readonly mediaService: MediaService,
        private readonly cipherService: CipherService,
        private readonly cipherSearchService: CipherSearchService,
        private readonly creditScoreService: CreditScoreService,
        private readonly loanEligibilityService: EligibilityService) { }

    async create(user: UserDto): Promise<User> {
        try {
            //Get the Credit Score And Its Rate
            const creditScore = this.creditScoreService.testCreditScore();
            const creditScoreRate = this.creditScoreService.creditScoreRate(creditScore);

            //Initializes Loan Eligibility List
            const loanEligibilityList: LoanEligibilityIssue[] = [LoanEligibilityIssue.Profile, LoanEligibilityIssue.EmploymentProfile,
            LoanEligibilityIssue.BusinessProfile, LoanEligibilityIssue.GuarantorProfile,
            LoanEligibilityIssue.NoBankDetails, LoanEligibilityIssue.NoDebitBankDetails];

            //Edits Based On Credit Score Issue    
            if (!creditScore || !creditScoreRate) {
                loanEligibilityList.push(LoanEligibilityIssue.NoCreditScore);
            }

            return await this.userPrisma.createUser(
                {
                    phoneNumber: user.phoneNumber.toLocaleLowerCase(),
                    email: user.email.toLocaleLowerCase(),
                    firstName: user.firstName.trimToSentenceCase(),
                    lastName: user.lastName.trimToSentenceCase(),
                    fullName: user.firstName.trimToSentenceCase() + " " + user.lastName.trimToSentenceCase(),
                    gender: Gender[user.gender],
                    bvn: user.bvn,
                    bvnIndex: user.bvnIndex,
                    pin: user.pin,
                    role: Role.LIVE_USER,
                    referralCode: user.referralCode,
                    referrerInfo: {
                        create:
                        {
                            referrer: user.referrer != null ? user.referrer : undefined,
                            surveyType: ReferralSurvey[user.surveyType],
                            surveyTypeOther: user.surveyTypeOther != null ? user.surveyTypeOther : undefined
                        }
                    },
                    loanEligibility: {
                        create:
                        {
                            creditScore: creditScore != null ? creditScore : undefined,
                            creditScoreRate: creditScoreRate != null ? creditScoreRate : undefined,
                            creditScoreUpdatedAt: new Date(),
                            currentTier: LoanTier.Tier0,
                            issues: loanEligibilityList
                        }
                    },

                },

            );
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async uploadImage(id: string, file: any): Promise<User> {
        try {
            const fileLink = await this.mediaService.uploadImage(file);
            return await this.userPrisma.updateUser(
                {
                    where: { id: Number(id) },
                    data: { userImage: fileLink },
                }
            );
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async updateProfile(id: string, file: any, user: UserUpdateInfoDto): Promise<User> {
    //     return await this.userPrisma.updateUser(
    //         {
    //             where: { id: Number(id) },
    //             data: {
    //                 maritalStatus: MaritalStatus[user.maritalStatus] != null ? MaritalStatus[user.maritalStatus] : undefined,
    //                 addressInfo: {
    //                     upsert: {
    //                         create: {
    //                             street: user.street,
    //                             city: user.city,
    //                             landMark: user.landMark != null ? user.landMark : undefined,
    //                             state: user.state.toString()
    //                         },
    //                         update: {
    //                             street: user.street,
    //                             city: user.city,
    //                             landMark: user.landMark != null ? user.landMark : undefined,
    //                             state: user.state.toString()
    //                         },
    //                     }
    //                 }
    //             },
    //         }
    //     );
    // }

    async createProfile(id: string, identityFile: Express.Multer.File, signatureFile: Express.Multer.File,
        user: UserInfoDto): Promise<User | null> {

        try {
            if (!identityFile) {
                throw new HttpException("Please add your NIN/Voters Card image for Identity", HttpStatus.BAD_REQUEST);
            }
            if (!signatureFile) {
                throw new HttpException("Please add your Image Of your Signature", HttpStatus.BAD_REQUEST);
            }
            const userWithNin = await this.findOneByNin(user.nin)
            if (userWithNin) {
                throw new BadRequestException("Nin has been reqistered")
            }
            //encrypt the nin and bvn
            const encryptNin = await this.cipherService.encryptWithAES(user.nin)

            // //encrypt the nin and bvn
            const ninIndexRequest = await this.cipherSearchService.getNINIndex(user.nin);

            var fileLink = await this.mediaService.uploadImage(identityFile)
                .catch(
                    error => {
                        throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                    });

            var signatureFileLink = await this.mediaService.uploadImage(signatureFile)
                .catch(
                    error => {
                        throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                    });
            return await this.userPrisma.updateUser(
                {
                    where: { id: Number(id) },
                    data: {
                        dateOfBirth: user.dateOfBirth,
                        maritalStatus: MaritalStatus[user.maritalStatus] != null
                            ? MaritalStatus[user.maritalStatus] : undefined,
                        identificationType: IdentificationType[user.identificationType]
                            ? IdentificationType[user.identificationType] : undefined,
                        nin: encryptNin,
                        ninIndex: ninIndexRequest,
                        identityUrl: identityFile != null && fileLink != null ? fileLink : undefined,
                        signatureUrl: signatureFile != null && signatureFileLink != null ? signatureFileLink : undefined,
                        isProfileComplete: true,
                        addressInfo: {
                            upsert: {
                                create: {
                                    address: user.address,
                                    landMark: getValueOrUndefined(user.landMark, true),
                                    state: user.state.toString()
                                },
                                update: {
                                    address: user.address,
                                    landMark: getValueOrUndefined(user.landMark),
                                    state: user.state.toString()
                                },
                            }
                        },
                    },
                }
            ).catch(
                error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                })
                .finally(() => {
                    this.loanEligibilityService
                        .updateEligibilityIssue(Number(id), LoanEligibilityIssue.Profile)
                });

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateProfile(id: string, file: any, user: UserUpdateInfoDto): Promise<User> {
        try {

            //const userInfo = await 

            if (file) {
                var fileLink = await this.mediaService.uploadImage(file);
            }
            return await this.userPrisma.updateUser(
                {
                    where: { id: Number(id) },
                    data: {
                        maritalStatus: MaritalStatus[user.maritalStatus] != null ? MaritalStatus[user.maritalStatus] : undefined,
                        userImage: file != null && fileLink != null ? fileLink : undefined,
                        addressInfo: {
                            upsert: {
                                create: {
                                    address: user.address,
                                    landMark: user.landMark != null ? user.landMark : undefined,
                                    state: user.state.toString()
                                },
                                update: {
                                    address: user.address,
                                    landMark: user.landMark != null ? user.landMark : undefined,
                                    state: user.state.toString()
                                },
                            }
                        }
                    },
                }
            ).finally(() => {

            });
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePin(user: UserPinDto): Promise<User> {
        try {
            const fetchedUser = await this.findOneByEmail(user.email);
            return await this.userPrisma.updateUser(
                {
                    where: { phoneNumber: fetchedUser.phoneNumber },
                    data: { pin: user.pin },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async updateBearerToken(userId: number, bearerTokenInput: string): Promise<User> {
        try {
            return await this.userPrisma.updateUser(
                {
                    where: { id: userId },
                    data: { bearerToken: bearerTokenInput },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async changePin(email: string, user: UserPinChangeDto) {
        try {
            const userResult = await this.findOneByEmail(email);
            if (!userResult) {
                throw new ForbiddenException('Something went wrong, imposter user');
            }

            const match = await this.cipherService.comparePassword(user.oldPin, userResult.pin);

            if (!match) {
                throw new UnprocessableEntityException("Old Pin is Incorrect")
            }

            // hash the password
            const newPassword = await this.cipherService.hashPassword(user.newPin);

            await this.userPrisma.updateUserOnly(
                {
                    where: { phoneNumber: userResult.phoneNumber },
                    data: {
                        pin: newPassword,
                        bearerToken: null
                    },
                });

        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByPhoneNumber(phoneNumberInput: string): Promise<User> {
        try {
            return await this.userPrisma.userByPhoneNumber({
                phoneNumber: phoneNumberInput
            });
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try { return await this.userPrisma.userByEmail({ email: email }) }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByParams(params): Promise<User> {
        try {
            return await this.userPrisma.checkUserByParams(params)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByPhoneNumberOrEmail(phoneNumber: string, email: string): Promise<User> {
        try {
            return await this.userPrisma.userByPhoneNumberOrEmail({ phoneNumber: phoneNumber }, { email: email })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }


    async findOneByPhoneNumberOrEmailOrBVn(phoneNumber: string, email: string, bvn: string): Promise<User> {
        try {
            const userWithEitherMobileOrEmail = await this.userPrisma.userByPhoneNumberOrEmail(
                { phoneNumber: phoneNumber },
                { email: email });
            const userWithBvn = await this.findOneByBvn(bvn)

            return userWithEitherMobileOrEmail || userWithBvn
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByBvn(bvn: string): Promise<User> {
        try {
            var finalUser: User = null
            // Getting the encrypt the bvn index
            const bvnIndex = await this.cipherSearchService.getBVNIndex(bvn);
            const users = await this.userPrisma.checkUsersByParams({ bvnIndex: bvnIndex })
            if (users) {
                users.every(user => {
                    const requestBvnToMatch = this.cipherService.decryptWithAES(user.bvn)
                    if (requestBvnToMatch == bvn || requestBvnToMatch === bvn) {
                        finalUser = user
                        return false;
                    }
                });
                ;
            }
            return finalUser
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByNin(nin: string): Promise<User> {
        try {
            var finalUser: User = null
            // Getting the encrypt the bvn index
            const ninIndex = await this.cipherSearchService.getNINIndex(nin);
            const users = await this.userPrisma.checkUsersByParams({ ninIndex: ninIndex })
            if (users) {
                users.every(user => {
                    const requestBvnToMatch = this.cipherService.decryptWithAES(user.nin)
                    if (requestBvnToMatch == nin || requestBvnToMatch === nin) {
                        finalUser = user
                        return false;
                    }
                });
                ;
            }
            return finalUser
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneById(idInput: string): Promise<User> {
        try {
            return await this.userPrisma.user({
                id: Number(idInput),
            })
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByUserId(idInput: number): Promise<User & {
        loanEligibility: LoanEligibility, addressInfo: AddressInfo,
        employmentInfo: EmploymentProfile, guarantor: Guarantor
    } | null> {
        try {
            return await this.userPrisma.userWithAdditionalFields({
                id: Number(idInput),
            })
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




}
