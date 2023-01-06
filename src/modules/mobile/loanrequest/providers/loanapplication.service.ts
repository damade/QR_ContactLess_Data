import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  LoanInfo, LoanRequestStatus, LoanTier, LoanTypes } from '@prisma/client';
import { AppLogger } from 'src/core/logger/logger';
import { generateUniqueCode, getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { addMonths } from 'src/core/utils/helpers/time.helper';
import {LoanType } from 'src/modules/public/loaninfo/model/loan.rate.entity';
import { BankDetailsService } from '../../bank/bank.details.service';
import { CardService } from '../../card/card.service';
import { LoanRequestDto } from '../dto/loan.request.dto';
import { PersonalLoanPreApplicationService } from './personalLoanpreapplication.service';
import { LoanInfoPrismaService } from '../service/loaninfo.prisma.service';

@Injectable()
export class LoanApplicationService {
    constructor(
        private readonly appLogger: AppLogger,
        private readonly loanInfoPrismaService: LoanInfoPrismaService,
        private readonly loanPreApplicationService: PersonalLoanPreApplicationService,
        private readonly bankDetailsService: BankDetailsService,
        private readonly cardService: CardService

    ) { }

    //Fetches Loan Level Of A User   
    async personalLoanApplication(customerId: number, loanType: LoanType, loanRequest: LoanRequestDto):

        Promise<LoanInfo | null> {
            
            const userMerittedFee = await this.loanPreApplicationService
            .personalLoanApplicationRequest(customerId, loanType)


            if(loanRequest.loanAmount > userMerittedFee.maxRange){
                throw new HttpException("Loan Amount Should Not Be More Than What You Can Get", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            const currentCardDetails = await this.cardService.getCardDetailByCardId(loanRequest.cardId);
            const currentBankDetails = await this.bankDetailsService.getBankDetailByUserId(customerId)

            if(!currentCardDetails || currentCardDetails.last4 != loanRequest.last4){
                throw new HttpException("Card Details Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
            }else if(currentCardDetails.isDefault == false){
                throw new HttpException("Card Can Not Be Charge Since It Is Not A Default Card", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            if(!currentBankDetails || currentBankDetails.nuban != loanRequest.nuban){
                throw new HttpException("Bank Details Not Found", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            const interestAmount =
             ((loanRequest.loanAmount) * ((loanRequest.loanInterestRate) / 100) * loanRequest.loanTenureInMonths)


            if(interestAmount != loanRequest.interestAmount){
                throw new HttpException("Interest Amount Does Not Match", HttpStatus.UNPROCESSABLE_ENTITY) 
            }

            const totalLoanAmount = loanRequest.loanAmount + interestAmount;

            if(totalLoanAmount != loanRequest.totalAmount){
                throw new HttpException("Total Loan Amount Does Not Match", HttpStatus.UNPROCESSABLE_ENTITY)  
            }

            const loanDueDate: Date = addMonths(new Date(), loanRequest.loanTenureInMonths);

            return await this.loanInfoPrismaService.createLoanInfo(
                {
                    uniqueId: generateUniqueCode(12),
                    loanAmount: loanRequest.loanAmount,
                    loanType: LoanTypes.Personal,
                    interestAmount,
                    loanTenure: loanRequest.loanTenure,
                    loanTenureInMonths: loanRequest.loanTenureInMonths,
                    reasonForLoan: getValueOrUndefined(loanRequest.reasonForLoan),
                    totalLoanAmount,
                    loanAmountDue: totalLoanAmount,
                    loanInterest: loanRequest.loanInterestRate,
                    loanDueDate: loanDueDate,
                    loanStatus: LoanRequestStatus.Pending,
                    user: {
                        connect: { id: customerId }
                    },
                    cardDetails:{
                        connect: {id: currentCardDetails.id}
                    },
                    bankDetails: {
                        connect: {id: currentBankDetails.id}
                    }
                },

            );

    }



}
