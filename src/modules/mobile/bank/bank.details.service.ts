import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BankDetails, LoanEligibility, LoanEligibilityIssue, SetupStatus } from '@prisma/client';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { BankService } from 'src/modules/public/bank/bank.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { BankDetailsDto } from './dto/bank.details.dto';
import { BankDetailsUpdateDto } from './dto/bank.details.update.dto';
import { BankDetailsPrismaService } from './service/bank.details.prisma.service';

@Injectable()
export class BankDetailsService {

    constructor(private readonly bankService: BankService,
        private readonly bankDetailsPrisma: BankDetailsPrismaService,
        private readonly loanEligibilityService: EligibilityService) { }

    //Adds Bank Details Without Returning Loan Issues    
    async createBankDetails(customerId: number, bankDetailsInfo: BankDetailsDto): Promise<BankDetails> {
        try {
            const checkExistingBankDetails = await this.bankDetailsPrisma.bankDetailInfoByUserId
                ({ userId: Number(customerId)})
            if (checkExistingBankDetails) {
                throw new HttpException("You already have a Bank Details, you can only edit", HttpStatus.BAD_REQUEST);
            }
            const verifyBankName = await this.bankService.getBankCode(bankDetailsInfo.bankName)
            if (!verifyBankName) {
                throw new HttpException("Bank Name Does Not Exist", HttpStatus.BAD_REQUEST);
            }
            const { bank, bankCode } = verifyBankName
            return await this.bankDetailsPrisma.createBankDetailsInfo({
                bankName: bank,
                nuban: bankDetailsInfo.accountName,
                nubanCode: bankCode,
                accountName: bankDetailsInfo.accountName,
                user: {
                    connect: { id: customerId }
                }
            }).finally(() => {
                this.loanEligibilityService
                    .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.NoBankDetails)
            });
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    
    //Adds Bank Details While Returning Loan Issues 
    async createBankDetailsWithLoanEligibility(customerId: number, bankDetailsInfo: BankDetailsDto): Promise<LoanEligibility> {
        try {
            const checkExistingBankDetails = await this.bankDetailsPrisma.bankDetailInfoByUserId
                ({ userId: Number(customerId)})
            if (checkExistingBankDetails) {
                throw new HttpException("You already have a Bank Details, you can only edit", HttpStatus.BAD_REQUEST);
            }
            const verifyBankName = await this.bankService.getBankCode(bankDetailsInfo.bankName)
            if (!verifyBankName) {
                throw new HttpException("Bank Name Does Not Exist", HttpStatus.BAD_REQUEST);
            }
            const { bank, bankCode } = verifyBankName
            await this.bankDetailsPrisma.createBankDetailsInfo({
                bankName: bank,
                nuban: bankDetailsInfo.nuban,
                nubanCode: bankCode,
                accountName: bankDetailsInfo.accountName,
                user: {
                    connect: { id: customerId }
                }}).catch(error => {
                    throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
                }).then(() => {
                    this.loanEligibilityService
                        .updateEligibilityIssue(Number(customerId), LoanEligibilityIssue.NoBankDetails)
                });
            return this.loanEligibilityService.findUserLoanEligibility(customerId)
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    //Updating Bank Details 
    async updateBankDetails(id: string, bankDetailsInput: BankDetailsUpdateDto): Promise<BankDetails> {

            //Checks If User Has Existing Loan.
            const userLoanIssue = await this.loanEligibilityService.findUserLoanEligibility(Number(id))
            if(userLoanIssue.hasPendingLoan){
                throw new HttpException("You have a pending loan, you can't update bank details.", HttpStatus.BAD_REQUEST); 
            }

            const bankDetailsInfo = await this.bankDetailsPrisma.bankDetailInfoByUserId({ userId: Number(id) })
            if (!bankDetailsInfo) {
                throw new HttpException("No existing bank details, You have to add one.", HttpStatus.BAD_REQUEST);
            }
            const verifyBankName = await this.bankService.getBankCode(bankDetailsInput.bankName)
            if (!verifyBankName) {
                throw new HttpException("Bank Name Does Not Exist", HttpStatus.BAD_REQUEST);
            }
            const { bank, bankCode } = verifyBankName
            return await this.bankDetailsPrisma.updateBankDetailsInfo(
                {
                    where: { id: bankDetailsInfo.id },
                    data: {
                        bankName: bank,
                        nuban: bankDetailsInput.nuban,
                        nubanCode: bankCode,
                        accountName: bankDetailsInput.accountName,
                    },
                }
            ).catch(error => {
                throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
            });
    }

    //Fetching Bank Details
    async getBankDetail(id: string): Promise<BankDetails | null> {
        try {
            return await this.bankDetailsPrisma.bankDetailInfoByUserId({ userId: Number(id) })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Fetching Bank Details
    async getBankDetailByUserId(id: number): Promise<BankDetails | null> {
        try {
            return await this.bankDetailsPrisma.bankDetailInfoByUserId({ userId: Number(id) })
        } catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
