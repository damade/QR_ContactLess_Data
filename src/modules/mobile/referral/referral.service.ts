import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { UsersService } from '../users/users.service';
import { EarnedReferralBonusInfo, ReferralBonusInfo, ReferralInfo } from './dto/referral.info';
import { ReferralPrismaService } from './service/referral.prisma.service';
import * as dotenv from 'dotenv';
import { ReferrerInfo, User } from '@prisma/client';
import { ApiData } from 'src/core/model/api.data';
import { AppLogger } from 'src/core/logger/logger';
dotenv.config();

@Injectable()
export class ReferralService {

    constructor(private readonly userService: UsersService,
        private readonly referralPrismaService: ReferralPrismaService,
        private readonly appLogger: AppLogger) { }

    async getUserReferralInfo(customerId: string): Promise<ReferralInfo> {
        try {
            const user = await this.userService.findOneById(customerId)
            if (!user) {
                throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
            }

            const referralUrl = `${process.env.APP_URL}/referral/${encodeURIComponent(user.referralCode)}`;

            const referralInfoData: ReferralInfo = {
                referralCode: user.referralCode,
                referralLink: referralUrl
            }

            return referralInfoData
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //I was not motivated while writing it 31st of May, 2022.
    async getReferralBonus(customerId: string): Promise<ApiData> {
        try {
            //Checks If User Exists
            const user = await this.userService.findOneById(customerId)
            if (!user) {
                throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
            }

            //Fetches Referral Info
            const referralInfo = await this.referralPrismaService.referrerInfosByReferralCode({
                referrer: user.referralCode,
                hasBeenPaid: false
            })

            //Checks If Referral Exists
            if (!referralInfo) {
                const data: ApiData = {
                    success: true, message: "No Referral For Now",
                    payload: {}
                };
                return data
            } else {

                //Transforms Data Into Another Type
                var referralBonusInfo: ReferralBonusInfo = {
                    referralId: [],
                    earnableBonusAmount: 0,
                    referralBonusInfo: []
                }

                referralInfo.forEach((element) => {
                    if (element.isVestable) {
                        //Adds Vestable Ids To List Of Ids
                        referralBonusInfo.referralId.push(element.id);

                        //Increment Earnable Count
                        referralBonusInfo.earnableBonusAmount = referralBonusInfo.earnableBonusAmount + 1
                    }
                    //Adds Further Info
                    referralBonusInfo.referralBonusInfo.push({
                        isVestable: element.isVestable,
                        refereeFullName: element.user.fullName
                    })
                })

                //Checks For Earnable Referrer
                if (!referralBonusInfo) {
                    const data: ApiData = {
                        success: true, message: "No Earnable Referral So Far",
                        payload: {}
                    };
                    return data
                } else {
                    //Sums Up The Cost
                    referralBonusInfo.earnableBonusAmount = (referralBonusInfo.earnableBonusAmount * 500)
                    const data: ApiData = {
                        success: true, message: "Referral Bonus Fetched Successfully",
                        payload: referralBonusInfo
                    };
                    return data
                }
            }
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    //I was not motivated while writing it 31st of May, 2022.
    async getAvailableReferralBonus(customerId: number): Promise<(ReferrerInfo & { user: User })[] | null> {
        try {
            //Checks If User Exists
            const user = await this.userService.findOneByUserId(customerId)
            if (!user) {
                throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
            }

            //Fetches Referral Info
            const referralInfo = await this.referralPrismaService.referrerInfosByReferralCode({
                referrer: user.referralCode,
                hasBeenPaid: false
            })

            return referralInfo;
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



    //I was not motivated while writing it 31st of May, 2022.
    async getReferralBonusHistory(customerId: string, page: string, limit: string ): Promise<ApiData> {
        try {
            //Checks If User Exists
            const user = await this.userService.findOneById(customerId)
            if (!user) {
                throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
            }

            //Fetches Referral Info
            const referralInfo = await this.referralPrismaService.paginatedReferrerInfosByReferralCode(
                {page: Number(page), limit: Number(limit)},
                {
                referrer: user.referralCode,
                hasBeenPaid: true
            })

            this.appLogger.log(referralInfo)

            //Checks If Referral Exists
            if (!referralInfo || referralInfo.length <= 0) {
                const data: ApiData = {
                    success: true, message: "No Referral Earned So For",
                    payload: {}
                };
                return data
            } else {

                //Transforms Data Into Another Type
                var referralBonusInfo: EarnedReferralBonusInfo = {
                    earnedBonusAmount: 0,
                    referralBonusInfo: []
                }
                                                                                                                                                                                                                                                                       
                referralInfo.forEach((element) => {
                    //Increment Earned Count
                   referralBonusInfo.earnedBonusAmount = 
                        referralBonusInfo.earnedBonusAmount + 1,
                    
                    referralBonusInfo.referralBonusInfo.push({
                        isVestable: element.isVestable,
                        refereeFullName: element.user.fullName
                    })
                })

                //Checks For Earnable Referrer
                if (!referralBonusInfo || referralBonusInfo.referralBonusInfo.length <= 0) {
                    const data: ApiData = {
                        success: true, message: "No Referral History So Far",
                        payload: {}
                    };
                    return data
                } else {
                    //Sums Up The Cost
                    referralBonusInfo.earnedBonusAmount = (referralBonusInfo.earnedBonusAmount * 500)
                    const data: ApiData = {
                        success: true, message: "Referral Bonus History Fetched Successfully",
                        payload: referralBonusInfo
                    };
                    return data
                }
            }
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



}
