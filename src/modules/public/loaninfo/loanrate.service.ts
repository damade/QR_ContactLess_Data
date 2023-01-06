import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { generateUniqueCode, getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import LoanRate, { ILoanRate } from './model/loan.rate.entity';
import { LoanRateInfoDto } from './model/loanrate.info.dto';
import { LoanRateInfoUpdateDto } from './model/loanrate.info.update.dto';

@Injectable()
export class LoanRateService {
    constructor(
        private readonly appLogger: AppLogger
    ) { }

    getLoanRateInfoViaUniqueId = async (uniqueId: string): Promise<ILoanRate> => {
        return await LoanRate.findOne({ uniqueId }).then((loanRateOutput: ILoanRate) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getLoanRateInfoViaTenure = async (tenure: string): Promise<ILoanRate> => {
        return await LoanRate.findOne({ tenure }).then((loanRateOutput: ILoanRate) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getLoanRateInfoViaLoanType = async (loanType: string): Promise<ILoanRate[]> => {
        return await LoanRate.find({ loanType }).then((loanRateOutput: ILoanRate[]) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getAllLoanRatesInfo = async (): Promise<ILoanRate[]> => {
        return await LoanRate.find({}).then((loanRateOutput: ILoanRate[]) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getAllUnCustomLoanRatesInfo = async (): Promise<ILoanRate[]> => {
        return await LoanRate.find({isCustom: false}).then((loanRateOutput: ILoanRate[]) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getFilterLoanRatesInfo = async (filter): Promise<ILoanRate[]> => {
        return await LoanRate.find(filter).then((loanRateOutput: ILoanRate[]) => {
            if (!loanRateOutput) {
                return null
            }
            return loanRateOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    saveLoanRate = async (loanRateDetails: LoanRateInfoDto) => {
        try {
            const loanRateInfoDoc: ILoanRate = new LoanRate({
                uniqueId: generateUniqueCode(6),
                tenure: loanRateDetails.tenure,
                loanType: loanRateDetails.loanType,
                rate: loanRateDetails.rate,
                isCustom: loanRateDetails.isCustom,
                isAvailableToAllTiers: loanRateDetails.isAvailableToAllTiers,
                tiersAvailable: getValueOrUndefined(loanRateDetails.tiersAvailable, false)
            });
            await loanRateInfoDoc.save()
            .catch(err => 
            {
                this.appLogger.error(err);
             throw new HttpException(getErrorMessage(err), HttpStatus.INTERNAL_SERVER_ERROR)
            });;
            return loanRateInfoDoc;
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    };

    updateLoanRate = async (uniqueId: string, loanRateDetails: LoanRateInfoUpdateDto) => {
        LoanRate.updateMany({ uniqueId },
            {
                $set: {
                tenure: loanRateDetails.tenure,
                rate: loanRateDetails.rate,
                isCustom: loanRateDetails.isCustom,
                isAvailableToAllTiers: loanRateDetails.isAvailableToAllTiers,
                tiersAvailable: getValueOrUndefined(loanRateDetails.tiersAvailable, false)
                }
            }
        )
            .then(updatedDoc => {
                return updatedDoc
            })
            .catch(err => {
                this.appLogger.error(err);
                throw new HttpException(getErrorMessage(err), HttpStatus.INTERNAL_SERVER_ERROR)
            })
    };

    deleteLoanRateInfo = async (uniqueId: string): Promise<Boolean> => {
        await LoanRate.deleteMany({ uniqueId }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
        return
    }
}
