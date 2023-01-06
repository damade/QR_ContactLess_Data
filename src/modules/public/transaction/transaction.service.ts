import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppLogger } from 'src/core/logger/logger';
import { getErrorMessage, PaystackErrorBuilder } from 'src/core/utils/helpers/error.helper';
import { consumers } from 'stream';

@Injectable()
export class TransactionService {
    constructor(private readonly appLogger: AppLogger) { }


    /**
    * PayStack Verify Transactions
    * @param {object} filter
    * @param {object} options
    * @returns {string}
    */

    checkTransaction = async (reference: string) => {

        try {
            const config = {
                method: 'Get',
                url: `https://api.paystack.co/transaction/verify/${reference}`,
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                    'Content-Type': 'application/json',
                },
            };

            return await axios(config)

        } catch (error) {
            const errorBuilder = PaystackErrorBuilder(error.response.data,error.response.status)
            throw new HttpException(JSON.stringify(errorBuilder), error.response.status);
        }


    }

    chargeAuthorization = async (authorization_code: string, email: string, amount: string) => {
        try {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transaction/charge_authorization',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                authorization_code,
                email,
                amount
            }
        };


         const cardPayment =  await axios(config)
        
         return cardPayment.data

    } catch (error) {
        const errorBuilder = PaystackErrorBuilder(error.response.data,error.response.status)
        throw new HttpException(JSON.stringify(errorBuilder), error.response.status);
    }

    }

    chargeAuthorizationFromCron = async (authorization_code: string, email: string, amount: string) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transaction/charge_authorization',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                authorization_code,
                email,
                amount
            }
        };

        const card = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                this.appLogger.log('charge_authorization error', error.response.data);
                return null
            });
        console.log('card>', card);
        return card;
    }

    refund = async (transaction) => {
        const config = {
            method: 'POST',
            url: `https://api.paystack.co/refund`,
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                transaction
            }
        };

        const refundUser = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('refundUser', refundUser);
        return refundUser;
    }

    /**
    * Update Requests
    * @param {string} requestId
    * @param {Object} payload
    * @param {string} whatToUpdate
    * @returns {string}
    */

    createTransactionReciept = async (name, account_number, bank_code) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transferrecipient',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                type: "nuban",
                name,
                account_number,
                bank_code,
                currency: "NGN"
            }
        };

        const receipt = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        console.log('receipt', receipt);
        return receipt;
    }

    initializeCard = async (email: string, amount: number, reference: string) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                email,
                amount: String(amount * 100),
                reference,
            }
        };

        const initialize = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        console.log('initialize', initialize);
        console.log('config', config);

        return initialize;
    }

    initiatePayment = async (amount, recipient) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transfer',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                source: "balance",
                amount,
                recipient,
                reason: 'Urbancare payment',
            }
        };

        const initialize = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        console.log('initialize', initialize);

        return initialize;
    }

    finalizePayment = async (requestBody) => {
        const { transfer_code, otp } = requestBody;
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/transfer/finalize_transfer',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                transfer_code,
                otp,
            }
        };

        const receipt = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        return receipt;
    }

    payLoan = async (email, amount, card, bank, authorization_code) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/charge',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                email,
                amount: amount * 100,
                card,
                bank,
                authorization_code
            }
        };

        const chargeCard = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('chargeCard', chargeCard);
        return chargeCard;
    }

    submitPin = async (pin, reference) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/charge/submit_pin',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                pin,
                reference,
            }
        };

        const pinSubmitted = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('pinSubmitted', pinSubmitted);
        return pinSubmitted;
    }

    submitOTP = async (otp, reference) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/charge/submit_otp',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                otp,
                reference,
            }
        };

        const otpSubmitted = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('otpSubmitted', otpSubmitted);
        return otpSubmitted;
    }

    createCustomer = async (email, first_name, last_name, phone) => {
        const config = {
            method: 'POST',
            url: 'https://api.paystack.co/customer',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                email,
                first_name,
                last_name,
                phone,
            }
        };

        const customer = await axios(config)
            .then(function (response) { return response.data.data })
            .catch(error => {
                throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST)
            });
        this.appLogger.log('customer', customer);
        return customer;
    }

}
