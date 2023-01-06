import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { User, Gender, MaritalStatus, Role, ReferralSurvey, LoanEligibilityIssue, IdentificationType, LoanEligibility, AddressInfo } from '@prisma/client';
import { ENUMS } from 'src/core/model/enums.entity';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { CipherSearchService } from 'src/core/utils/service/cipher.search.service';
import { CipherService } from 'src/core/utils/service/cipher.service';
import { MediaService } from 'src/core/utils/service/media.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { UserDto } from './dto/user.dto';
import { UserInfoDto } from './dto/user.info.dto';
import { UserPinDto } from './dto/user.pin.dto';
import { UserPinChangeDto } from './dto/user.pin.update.dto';
import { UserUpdateInfoDto } from './dto/user.update.info.dto';
import { UsersPrismaService } from './services/users.prisma.service';

@Injectable()
export class UsersFinanceService {

    constructor(private readonly userPrisma: UsersPrismaService,
        private readonly loanEligibilityService: EligibilityService) { }


    async updateWallet(userId: number, amount: number): Promise<User> {
        try {

            return await this.userPrisma.updateUser(
                {
                    where: { id: userId },
                    data: { 
                        walletBalance: {
                            increment: amount
                        } },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deductLoanBalance(userId: number, amount: number): Promise<User> {
        try {

            return await this.userPrisma.updateUser(
                {
                    where: { id: userId },
                    data: { 
                        currentLoanBalance:{
                            increment: (-1 * amount)
                        } },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addLoanBalance(userId: number, amount: number): Promise<User> {
        try {

            return await this.userPrisma.updateUser(
                {
                    where: { id: userId },
                    data: { 
                        currentLoanBalance:{
                            increment: amount
                        } },
                });
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
