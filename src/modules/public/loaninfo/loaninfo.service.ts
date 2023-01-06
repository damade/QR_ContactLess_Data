import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { EligibilityService } from 'src/modules/mobile/eligibility/eligibility.service';
import LoanTier, { ILoanTier, LoanTierGroup } from './model/loan.tier.entity';
import { LoanTierInfoDto } from './model/loantier.info.dto';
import { LoanTierInfoUpdateDto } from './model/loantier.info.update.dto';

@Injectable()
export class LoaninfoWebService {
    constructor(
        private readonly appLogger: AppLogger,
        private readonly loanEligibilityService: EligibilityService
    ) { }

    getLoanTierInfo = async (loanTier: string): Promise<ILoanTier> => {
        return await LoanTier.findOne({ loanTier }).then((loanTierOutput: ILoanTier) => {
            if (!loanTierOutput) {
                return null
            }
            return loanTierOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getAllLoanTIersInfo = async (): Promise<ILoanTier[]> => {
        return await LoanTier.find({}).then((loanTierOutput: ILoanTier[]) => {
            if (!loanTierOutput) {
                return null
            }
            return loanTierOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getUnCustomAllLoanTIersInfo = async (): Promise<ILoanTier[]> => {
        return await LoanTier.find({isCustom: false}).then((loanTierOutput: ILoanTier[]) => {
            if (!loanTierOutput) {
                return null
            }
            return loanTierOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    saveLoanTier = async (loanTierDetails: LoanTierInfoDto) => {
        try {
            const loanTierInfoDoc: ILoanTier = new LoanTier({
                loanTier: loanTierDetails.loanTier,
                minRange: loanTierDetails.minRange,
                maxRange: loanTierDetails.maxRange,
                isCustom: loanTierDetails.isCustom
            });
           await loanTierInfoDoc.save()
            .catch(err => 
            {
                this.appLogger.error(err);
             throw new HttpException(getErrorMessage(err), HttpStatus.INTERNAL_SERVER_ERROR)
            });
            return loanTierInfoDoc;
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    };

    updateLoanTier = async (loanTier: LoanTierGroup,loanTierDetails: LoanTierInfoUpdateDto) => {
       await LoanTier.updateOne({loanTier},
            {
                $set: {
                    minRange: loanTierDetails.minRange,
                    maxRange: loanTierDetails.maxRange,
                    isCustom: loanTierDetails.isCustom
                }
            }
        ).catch(err => {
                this.appLogger.error(err);
                throw new HttpException(getErrorMessage(err), HttpStatus.INTERNAL_SERVER_ERROR)
            })

            return loanTierDetails
    };

    updateUserLoanTier = async (userId: number, loanTier: LoanTierGroup) => {
        userId = Number(userId)
        await this.loanEligibilityService.updateUserLoanTier(userId, loanTier)
            .then(res => {
                return res
            })
            .catch(err => {
                 this.appLogger.error(err);
                 throw new HttpException(getErrorMessage(err), HttpStatus.INTERNAL_SERVER_ERROR)
             })  
     };

    deleteLoanTierInfo = async (loanTier: LoanTierGroup): Promise<Boolean> => {
        await LoanTier.deleteMany({ loanTier }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
        return
    }
}
