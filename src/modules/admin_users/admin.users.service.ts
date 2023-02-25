import { ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
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

@Injectable()
export class AdminUsersService {

    constructor(private readonly userDB: AdminUsersDatabaseService,
        private readonly cipherService: CipherService,
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
                })["_doc"];
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

    async findOneById(idInput: string): Promise<IAdminUser> {
        try {
            return await this.userDB.adminUser(idInput)
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

}
