import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import mongoose from 'mongoose';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { AdminUserDto } from './dto/admin.user.dto';
import { AdminUserPasswordDto } from './dto/admin.user.pin.dto';
import { AdminUserPasswordChangeDto } from './dto/admin.user.pin.update.dto';
import { AdminUsersDatabaseService } from './services/admin.users.db.service';
import { mapToAdminUser } from './mapper/admin.user.mapper';
import { QrService } from 'src/core/utils/service/qr.service';
import { AppLogger } from 'src/core/logger/logger';
import { IAdminUser } from './model/admin.user.entity';
import { generateUniqueCode } from 'src/core/utils/helpers/string.helper';
import { BankAccountService } from '../bankaccount/bank.account.service';
import { BvnService } from '../bvn/bvn.service';
import { UsersService } from '../users/users.service';
import { RequestForApprovalDto } from './dto/req.approval.dto';
import { genericExclude } from 'src/core/utils/helpers/prisma.helper';
import { RequestForDisapprovalDto } from './dto/req.disapproval.dto';

@Injectable()
export class AdminUsersService {

    constructor(private readonly userDB: AdminUsersDatabaseService,
        private readonly cipherService: CipherService,
        private readonly bankAccountService: BankAccountService,
        private readonly bvnAccountService: BvnService,
        private readonly customerService: UsersService,
        private readonly appLogger: AppLogger) { }

    async create(user: AdminUserDto): Promise<IAdminUser> {
        try {
            // hash the password
            const hashPassword = await this.cipherService.hashPassword(user.password);

            const createAdminUser =
                await this.userDB.createUser(mapToAdminUser({ ...user, password: hashPassword, uniqueId: generateUniqueCode(7) }));

            return createAdminUser["_doc"]
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePassword(user: AdminUserPasswordDto): Promise<IAdminUser> {
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



    async updateBearerToken(userId: string, bearerTokenInput: string): Promise<IAdminUser> {
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

    async changePassword(email: string, user: AdminUserPasswordChangeDto) {
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

    async findOneByPhoneNumber(phoneNumberInput: string): Promise<IAdminUser> {
        try {
            return await this.userDB.userByPhoneNumber(phoneNumberInput);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByEmail(email: string): Promise<IAdminUser> {
        try { return await this.userDB.userByEmail(email) }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByParams(params): Promise<IAdminUser> {
        try {
            return await this.userDB.checkUserByParams(params)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByPhoneNumberOrEmail(phoneNumber: string, email: string): Promise<IAdminUser> {
        try {
            return await this.userDB.userByPhoneNumberOrEmail(phoneNumber, email)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneByPhoneNumberOrEmailOrStaffId(phoneNumber: string, email: string, staffId: string): Promise<IAdminUser> {
        try {
            return await this.userDB.userByPhoneNumberOrEmailOrStaffId(phoneNumber, email, staffId)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findOneById(idInput: string): Promise<IAdminUser> {
        try {
            return await this.userDB.adminUser(idInput)
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async getYetToApproveBvnUsers() {
        return await this.bvnAccountService.findUnapprovedBvns();

    }

    async getYetToApproveUsersBvn() {
        return await this.customerService.unApprovedBvns();
    }

    async getYetToApproveUsersBankInfo() {
        return await this.customerService.unApprovedBankInfos();
    }

    async getYetToApproveBankInfoUsers() {
        return await this.bankAccountService.findUnapprovedBankInfos();
    }

    async getApprovedBvnUsers() {
        return await this.bvnAccountService.findApprovedBvns();
    }

    async getApprovedUsersBvn() {
        return await this.customerService.approvedBvns();
    }

    async getApprovedBankInfoUsers() {
        return await this.bankAccountService.findApprovedBankInfos();
    }

    async getApprovedUsersBankInfo() {
        return await this.customerService.approvedBankInfos();
    }

    async approveBvn(requestDto: RequestForApprovalDto) {
        const user = await this.customerService.findOneByParams({
            uniqueId: requestDto.uniqueId,
            email: requestDto.email,
            phonNumber: requestDto.phoneNumber,
            _id: new mongoose.Types.ObjectId(requestDto.userId),
            isCreatingBvn: true, isCreatingAccount: true,
            hasAccountBeenApproved: false, hasBvnBeenApproved: false
        })

        if (!user) {
            throw new UnprocessableEntityException("User Info Does Not Match or Bvn has been Approved")
        }

        const updatedUser = await this.bvnAccountService.approveUserBvnCreation(user._id)
            .then(async () => {
                return await this.bankAccountService.approveUserBankAccountCreation(user._id).then(
                    async () => {
                        return await this.customerService.updateApprovedAccountCreation(user._id)
                    }
                )

            });

        return updatedUser
    }

    async approveBankInfo(requestDto: RequestForApprovalDto) {
        const user = await this.customerService.findOneByParams({
            uniqueId: requestDto.uniqueId,
            email: requestDto.email,
            phonNumber: requestDto.phoneNumber,
            _id: new mongoose.Types.ObjectId(requestDto.userId),
            isCreatingAccount: true,
            hasAccountBeenApproved: false, hasBvnBeenApproved: false
        })

        if (!user) {
            throw new UnprocessableEntityException("User Info Does Not Match or Bvn has been Approved")
        }

        const updatedUser = await this.bankAccountService.approveUserBankAccountCreation(user._id).then(
            async () => {
                return await this.customerService.updateApprovedAccountCreation(user._id)
            }
        )

        return updatedUser
    }

    async disapprove(requestDto: RequestForDisapprovalDto) {
        const user = await this.customerService.findOneByParams({
            uniqueId: requestDto.uniqueId,
            email: requestDto.email,
            phonNumber: requestDto.phoneNumber,
            _id: new mongoose.Types.ObjectId(requestDto.userId),
            isCreatingAccount: true,
            hasAccountBeenApproved: false, hasBvnBeenApproved: false
        })

        if (!user) {
            throw new UnprocessableEntityException("User Info Does Not Match or Bvn has been Approved")
        }

        return await this.customerService.disapprovedAccountCreation(
            user._id, requestDto.isProfileImageTheIssue, requestDto.isSignatureImageTheIssue,
             requestDto.comment
        )

    }

    async getCustomerInfo(uniqueId: string, userId: string) {
        const user = await this.customerService.findOneByParams({
            uniqueId,
            _id: new mongoose.Types.ObjectId(userId),
        })

        if (!user) {
            throw new BadRequestException("No User Found/Matched")
        }

        const userWithAdditionalFields = await this.customerService
            .getUserProfile(userId)
            
        if (!user || !userWithAdditionalFields) {
            throw new BadRequestException("No User Found/Matched")
        }

        return genericExclude(userWithAdditionalFields)
    }
}
