import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CardDetails, LoanEligibilityIssue } from '@prisma/client';
import { NOTFOUND } from 'dns';
import { AppLogger } from 'src/core/logger/logger';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { TransactionService } from 'src/modules/public/transaction/transaction.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { UsersFinanceService } from '../users/users.finance.service';
import { UsersService } from '../users/users.service';
import { AddCardRequestDto } from './dto/card.requests.dto';
import { AddCardDetailsPrismaService } from './service/add.card.details.prisma.service';
import { CardDetailsPrismaService } from './service/card.details.prisma.service';

@Injectable()
export class CardService {

    constructor(
        private readonly appLogger: AppLogger,
        private readonly cardDetailsPrisma: CardDetailsPrismaService,
        private readonly userFinanceService: UsersFinanceService,
        private readonly userService: UsersService,
        private readonly transactionService: TransactionService,
        private readonly addCardDetailsPrisma: AddCardDetailsPrismaService,
        private readonly loanEligibilityService: EligibilityService) { }

    //Adds Bank Details Without Returning Loan Issues    
    async addCardDetails(customerId: number, cardRequestInfo: AddCardRequestDto): Promise<CardDetails> {
    
            if (customerId !== cardRequestInfo.userId) {
                throw new UnauthorizedException('User IDs do not match');
            }   

            //Check User Information
            const userInfo = await this.userService.findOneByUserId(customerId)

            //Checks if user is owing
            if (userInfo.currentLoanBalance > 0 || userInfo.loanEligibility.hasPendingLoan) {
                throw new HttpException("You are not eligible to add card yet.", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            //Check if transaction reference works fine.
            const transaction = await this.transactionService.checkTransaction(cardRequestInfo.reference)
            .catch(err => {
                    const newError = JSON.parse(err.message)
                    throw new HttpException(newError.message, newError.statusCode);
                })
            
            if (!transaction.data) {
                throw new HttpException("Transaction could not be verified", HttpStatus.NOT_FOUND)
            }

            //Extracts Needed Card Details From Verifying Transaction
            const { authorization: { reusable, last4, brand, authorization_code, bank, account_name } } = transaction.data.data

            if (!reusable) {
                throw new HttpException("Card can not be used as it is not reusable.", HttpStatus.NOT_FOUND)
            }

            const existingCardDetails = await this.cardDetailsPrisma.cardDetailInfoByUserId({
                OR: [
                    {
                        last4: last4
                    },{
                        last4: last4,
                        userId: customerId
                    }
                ]
                
            }) 

            //Checks if transaction details already exist
            if(existingCardDetails){
                throw new HttpException("Card Details Already Exists", HttpStatus.FORBIDDEN)
            }

            //Adds Card Details
           const cardDetails = await this.cardDetailsPrisma.createCardDetailsInfo({
                last4: last4,
                brand: brand,
                cardBank: bank,
                accountName: account_name,
                reusable: reusable,
                authorizationCode: authorization_code,
                user: {
                    connect: { id: customerId }
                }
            })
            .finally(async () => {
              await this.addCardDetailsPrisma.createAddCardDetailsInfo({
                    last4: last4,
                    brand: brand,
                    amount: cardRequestInfo.amount,
                    
                    user: {
                        connect: { id: customerId }
                    }
                }).catch(error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                })
                .finally(() => {
                    this.loanEligibilityService
                            .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.NoDebitBankDetails)
                });
                this.userFinanceService.updateWallet(customerId,cardRequestInfo.amount)
                this.loanEligibilityService
                        .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.NoDebitBankDetails)
            }).catch(error => {
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });

            if(cardRequestInfo.isDefaultCard){
              return await this.makeDefaultCard(customerId, cardDetails.last4).catch(error => {
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
            }else{
              return cardDetails  
            }
        
    }

    //Adds Bank Details While Returning Loan Issues 
    async makeDefaultCard(customerId: number, last4: string): Promise<CardDetails> {
        try {
            return await this.cardDetailsPrisma.makeDefaultCard(customerId, last4);
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    //Fetching User Card Details
    async getCardDetails(id: string): Promise<CardDetails[] | null> {
        try {
            return await this.cardDetailsPrisma.cardDetailsInfoByUserId({ userId: Number(id) })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Fetching A User Card Detail
    async getCardDetail(id: string, last4: string): Promise<CardDetails | null> {
        try {
            return await this.cardDetailsPrisma.cardDetailInfoByUserId({ 
                userId: Number(id),
                last4: last4
             })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Fetching A User Card Detail By User Id
    async getCardDetailByUserId(id: number, last4: string): Promise<CardDetails | null> {
        try {
            return await this.cardDetailsPrisma.cardDetailInfoByUserId({ 
                userId: Number(id),
                last4: last4
             })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Fetching A User Card Detail By Card Id
    async getCardDetailByCardId(id: number): Promise<CardDetails | null> {
        try {
            return await this.cardDetailsPrisma.cardDetailInfo({id: id})
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Deleting User Card Details
    async deleteCardDetail(cardId: string, userId: string): Promise<CardDetails| null> {
        try {
            const existingCardDetails = await this.getCardDetails(userId)

            //Checks if there is card attached to the user
            if(existingCardDetails.length < 1){
                throw new HttpException("User has no card attached.", HttpStatus.FORBIDDEN)
            }

             //Checks if transaction details already exist
             if(existingCardDetails.length <= 1 ){
                throw new HttpException("You have only one card attached.", HttpStatus.FORBIDDEN)
            }

            //Check User Information
            const userInfo = await this.userService.findOneByUserId(Number(userId))

            //Checks if user is owing
            if (userInfo.currentLoanBalance > 0 || userInfo.loanEligibility.hasPendingLoan) {
                throw new HttpException("You are not eligible to delete card yet.", HttpStatus.UNPROCESSABLE_ENTITY);
            }

            return await this.cardDetailsPrisma.deleteCardDetailsInfo({ id: Number(cardId) })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
