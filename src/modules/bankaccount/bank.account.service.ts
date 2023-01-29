import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { MediaService } from 'src/core/utils/service/media.service';
import { IUser } from '../users/model/user.entity';
import { UsersService } from '../users/users.service';
import { BankProfileDto } from './dto/bank.account.dto';
import { mapToBankAcount } from './mapper/bank.account.mapper';
import { IBankAccount } from './model/bank.account.entity';
import { BankAccountDatabaseService } from './services/bank.account.db.service';
@Injectable()
export class BankAccountService {

    constructor(private readonly bankAccountDB: BankAccountDatabaseService,
        private readonly mediaService: MediaService,
        private readonly cipherService: CipherService,
        private readonly cipherSearchService: CipherSearchService,
        private readonly usersService: UsersService) { }

    async create(signatureFile: Express.Multer.File, profileImage: Express.Multer.File,
         bankAccountDto: BankProfileDto): Promise<IBankAccount> {
        try {

            // Check if profile image file is empty
            if (!profileImage) {
                throw new HttpException("Please add your image for Identity", HttpStatus.BAD_REQUEST);
            }

            // Check For existing NIN
            const userWithNin = await this.findOneByNin(bankAccountDto.nin)

            if (userWithNin) {
                throw new BadRequestException("Nin has been reqistered")
            }

            // Check for exiating BVN
            const userWithBvn = await this.findOneByBvn(bankAccountDto.bvn)

            if (userWithBvn) {
                throw new BadRequestException("Bvn has been reqistered")
            }

            // //encrypt the nin and bvn for indexes
            const bvnIndexRequest = await this.cipherSearchService.getBVNIndex(bankAccountDto.bvn);

            // //encrypt the nin and bvn
            const encryptBvn = await this.cipherService.encryptWithAES(bankAccountDto.bvn);

            //encrypt the nin and bvn
            const encryptNin = await this.cipherService.encryptWithAES(bankAccountDto.nin)

            // //encrypt the nin and bvn
            const ninIndexRequest = await this.cipherSearchService.getNINIndex(bankAccountDto.nin);

            var fileLink = await this.mediaService.uploadImage(profileImage)
                .catch(
                    error => {
                        throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                    });

            return await this.usersService.create(signatureFile, bankAccountDto.user, false, true)
                .then(async (user: IUser) => {
                    return await this.bankAccountDB.createBankAccount(
                        mapToBankAcount({...bankAccountDto, userId: user._id,
                        bvn: encryptBvn, bvnIndex: bvnIndexRequest, nin: encryptNin,
                        ninIndex: ninIndexRequest, userImage: fileLink })
                    );
                })
                .catch(error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                })

        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneById(userId: string): Promise<IBankAccount> {
        try {
            return await this.bankAccountDB.bankAccountInfoWithBasicUserInfo(userId);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOneByIdAdmin(userId: string): Promise<IBankAccount> {
        try {
            return await this.bankAccountDB.bankAccountInfoWithBasicUserInfo(userId);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async deleteOneById(userId: string): Promise<IBankAccount> {
        try {
            return await this.bankAccountDB.deleteBankInfo(userId);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async findOneByParams(params): Promise<IBankAccount> {
        try {
            return await this.bankAccountDB.checkBankAccountByParams(params)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async uploadImage(id: string, file: any): Promise<IBankAccount> {
        try {

            // Check if profile image file is empty
            if (!file) {
                throw new HttpException("Please add your image for Identity", HttpStatus.BAD_REQUEST);
            }

            const fileLink = await this.mediaService.uploadImage(file);
            return await this.bankAccountDB.updateBankInfoViaUserIdOnly(
                {
                    uniqueId: id,
                    newData: { userImage: fileLink },
                }
            );
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    private async findOneByNin(nin: string): Promise<IBankAccount> {
        try {
            var finalUser: IBankAccount = null
            // Getting the encrypt the bvn index
            const ninIndex = await this.cipherSearchService.getNINIndex(nin);
            const users = await this.bankAccountDB.checkBankInfosByParams({ ninIndex: ninIndex })
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

    async findOneByBvn(bvn: string): Promise<IBankAccount> {
        try {
            var finalUser: IBankAccount = null
            // Getting the encrypt the bvn index
            const bvnIndex = await this.cipherSearchService.getBVNIndex(bvn);
            const users = await this.bankAccountDB.checkBankInfosByParams({ bvnIndex: bvnIndex })
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
}
