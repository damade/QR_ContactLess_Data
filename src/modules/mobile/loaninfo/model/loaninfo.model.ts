import { CreditScoreRate, LoanTier } from "@prisma/client";
import { ILoanRate, LoanType } from "src/modules/public/loaninfo/model/loan.rate.entity";
import { ILoanTier } from "src/modules/public/loaninfo/model/loan.tier.entity";

export type LoanLevelInfo = {
    currentLoanTier?: LoanTier,
    loanTiers?: ILoanTier[],
}

export type LoanRateInfo = {
    loanType: string,
    newLoanRate: ILoanRate[],
}

export type CreditScoreInfo = {
    currentLoanTier?: LoanTier,
    creditScore: number,
    internalCreditScoreRating: number,
    creditScoreRate: CreditScoreRate,
}