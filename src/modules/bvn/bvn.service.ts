import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { BvnCreationData } from 'src/core/model/util.data';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { generateUniqueBvn } from 'src/core/utils/helpers/string.helper';
import { IUser } from '../users/model/user.entity';
import { UsersService } from '../users/users.service';
import { BvnDto } from './dto/bvn.dto';
import { mapToBvn } from './mapper/bvn.mapper';
import { IBvn } from './model/bvn.entity';
import { BvnDatabaseService } from './services/bvn.db.service';

@Injectable()
export class BvnService {

    constructor(
        private readonly bvnDB: BvnDatabaseService,
        private readonly appLogger: AppLogger,
        private readonly usersService: UsersService) { }

    async create(signatureFile: Express.Multer.File, bvnDto: BvnDto): Promise<IBvn> {
        try {

            const generatedBvn = generateUniqueBvn()

            return await this.usersService.create(signatureFile, bvnDto.bankProfile.user, true, true)
                .then(async (user: IUser) => {
                    return await this.bvnDB.createBvn(
                        mapToBvn({
                            ...bvnDto, userId: user._id,
                            bvn: generatedBvn
                        })
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

    async createWithoutImage(bvnDto: BvnDto): Promise<BvnCreationData> {
        try {
            const generatedBvn = generateUniqueBvn()
            return await this.usersService.createWithoutImage(bvnDto.bankProfile.user, true, true)
                .then(async (user: IUser) => {
                    const createdBvnInfo = await this.bvnDB.createBvn(
                        mapToBvn({
                            ...bvnDto, userId: user._id,
                            bvn: generatedBvn
                        })
                    );
                    return {user, bvnInfo: createdBvnInfo["_doc"]}
                })
                .catch(error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                })
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async findOneById(userId: string): Promise<IBvn> {
        try {
            return await this.bvnDB.bvnInfoWithBasicUserInfo(userId);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async deleteOneById(userId: string): Promise<IBvn> {
        try {
            return await this.bvnDB.deleteBvn(userId);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async findOneByParams(params): Promise<IBvn> {
        try {
            return await this.bvnDB.checkBvnByParams(params)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findUnapprovedBvns(): Promise<IBvn[]>{
        return await this.bvnDB.unApprovedBvnInfos()
     }
 
     async findApprovedBvns(): Promise<IBvn[]>{
         return await this.bvnDB.approvedBvnInfos()
     }

    async approveUserBvnCreation(userId: string): Promise<IBvn>{
        return await this.bvnDB.approveUserBvnCreation(userId)
    }
}
