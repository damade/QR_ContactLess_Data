import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppLogger } from 'src/core/logger/logger';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { BankDto } from './dto/bank.dto';
import axios from 'axios';
import Bank, { IBank } from './model/bank.entity';

@Injectable()
export class BankService {
    constructor(private readonly appLogger: AppLogger) { }

    getBankCode = async (bank: string): Promise<IBank> => {
        return await Bank.findOne({ bank }).then((bankOutput: IBank) => {
            if (!bankOutput) {
                return null
            }
            return bankOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    getAllBanks = async (): Promise<IBank[]> => {
        return await Bank.find({}).sort({bank: 1}).then((bankOutput: IBank[]) => {
            if (!bankOutput) {
                return null
            }
            return bankOutput
        }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
    }

    saveBankCode = async (bankDetails: BankDto) => {
        try {
            const referralCodeDoc: IBank = new Bank({
                bank: bankDetails.bank,
                bankCode: bankDetails.bankCode,
                bankShortName: bankDetails.bankShortName
            });
            referralCodeDoc.save();
            return referralCodeDoc;
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    };

    deleteBankCode = async (bank): Promise<Boolean> => {
        await Bank.deleteMany({ bank }).catch(error => {
            // console.error(error.message);
            this.appLogger.log(error.message);
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        });
        return
    }

    klogin = async () => {
        const config = {
            method: 'POST',
            url: 'https://hanchor.herokuapp.com/hanchor/login',
            headers: {
                //Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                email: "admin@hanchor.com",
                password: "123456"
            }
        };


        const card = await axios(config)
            .then(function (response) { 
                return response.headers; })
            .catch(error => {
                this.appLogger.log(error)
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('card>', card);
        return card;
    }
}
