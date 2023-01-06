import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoanEligibilityIssue, LoanEligibility, LoanTier, CreditScoreRate } from '@prisma/client';
import { getErrorMessage } from 'src/core/utils/helpers/error.helper';
import { getValueOrUndefined } from 'src/core/utils/helpers/string.helper';
import { EligibilityPrismaService } from './eligibility.prisma.service';

@Injectable()
export class EligibilityService {

    constructor(private readonly eligibilityPrisma: EligibilityPrismaService) { }

    async updateEligibilityIssue(userId: number, loanEligibilityIssueToRemove: LoanEligibilityIssue): Promise<Boolean> {
        try {
            const userLoanEligibility = await this.findOneByUserId(userId)
            if (userLoanEligibility) {
                userLoanEligibility.issues = userLoanEligibility.issues
                    .filter(item => item != loanEligibilityIssueToRemove);

                await this.eligibilityPrisma.updateLoanEligibility({
                    where: { id: userLoanEligibility.id },
                    data: {
                        issues: userLoanEligibility.issues,
                        isEligible: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? true : undefined,
                        currentTier: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? LoanTier.Tier1 : undefined,
                    }
                })
                return true
            }
            return false
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUserLoanTier(userId: number, loanTier: any): Promise<Boolean> {
        try {

            await this.eligibilityPrisma.updateLoanEligibility({
                where: { userId: userId },
                data: {
                    currentTier: loanTier,
                }
            })
            return true
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUserCreditScore(userId: number, creditScore: number, creditScoreRate: CreditScoreRate): Promise<LoanEligibility> {
        try {
            return  await this.eligibilityPrisma.updateLoanEligibility({
                where: { userId: userId },
                data: {
                    creditScore,
                    creditScoreRate,
                    creditScoreUpdatedAt: new Date()
                } 
            })
            
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUserCreditScorWithTier(userId: number, loanTier: LoanTier,
        creditScore: number, creditScoreRate: CreditScoreRate): Promise<LoanEligibility> {
        try {
            return  await this.eligibilityPrisma.updateLoanEligibility({
                where: { userId: userId },
                data: {
                    currentTier: loanTier,
                    creditScore,
                    creditScoreRate,
                    creditScoreUpdatedAt: new Date()
                } 
            })
            
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateInternalCreditScore(userId: number, creditScore: number): Promise<LoanEligibility> {
        try {

            return await this.eligibilityPrisma.updateLoanEligibility({
                where: { userId: userId },
                data: {
                    internalCreditScore: creditScore
                } 
            })
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeCustomEligibilityIssue(userId: number): Promise<Boolean> {
        try {
            const userLoanEligibility = await this.findOneByUserId(userId)
            if (userLoanEligibility) {
                userLoanEligibility.issues = userLoanEligibility.issues
                    .filter(item => item != LoanEligibilityIssue.Custom);

                await this.eligibilityPrisma.updateLoanEligibility({
                    where: { id: userLoanEligibility.id },
                    data: {
                        issues: userLoanEligibility.issues,
                        reasonForIssues: null,
                        isEligible: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? true : undefined,
                        currentTier: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? LoanTier.Tier1 : undefined,
                    }
                })
                return true
            }
            return false
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateCustomEligibilityIssue(userId: number, reasonForIssues: string): Promise<Boolean> {
        try {
            const userLoanEligibility = await this.findOneByUserId(userId)
            if (userLoanEligibility) {
                userLoanEligibility.issues = userLoanEligibility.issues
                    .filter(item => item != LoanEligibilityIssue.Custom);

                userLoanEligibility.issues.push(LoanEligibilityIssue.Custom)
                await this.eligibilityPrisma.updateLoanEligibility({
                    where: { id: userLoanEligibility.id },
                    data: {
                        issues: userLoanEligibility.issues,
                        reasonForIssues: reasonForIssues,
                        isEligible: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? true : undefined,
                        currentTier: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? LoanTier.Tier1 : undefined,
                    }
                })
                return true
            }
            return false
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addEligibilityIssue(userId: number, loanEligibilityIssueToAdd: LoanEligibilityIssue): Promise<Boolean> {
        try {
            const userLoanEligibility = await this.findOneByUserId(userId)
            if (userLoanEligibility) {
                userLoanEligibility.issues.push(loanEligibilityIssueToAdd)
                await this.eligibilityPrisma.updateLoanEligibility({
                    where: { id: userLoanEligibility.id },
                    data: {
                        issues: userLoanEligibility.issues,
                        isEligible: userLoanEligibility.issues == null ||
                            userLoanEligibility.issues.length < 1 ? true : undefined,
                    }
                })
                return true
            }
            return false
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private async findOneByUserId(idInput: number): Promise<LoanEligibility> {
        try {
            return await this.eligibilityPrisma.loanEligibilityByUserId({
                userId: Number(idInput),
            })
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

    async findUserLoanEligibility(idInput: number): Promise<LoanEligibility> {
        try {
            return await this.eligibilityPrisma.loanEligibilityByUserId({
                userId: Number(idInput),
            })
        }
        catch (error) {
            throw new HttpException(getErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR)
        };
    }

}
