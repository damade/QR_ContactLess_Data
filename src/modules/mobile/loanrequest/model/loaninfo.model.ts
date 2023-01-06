import { LoanTier } from "@prisma/client";
import { ILoanRate, LoanType } from "src/modules/public/loaninfo/model/loan.rate.entity";
import { ILoanTier } from "src/modules/public/loaninfo/model/loan.tier.entity";

export type LoanApplicationInfo = {
    currentLoanTier?: LoanTier,
    minRange: number,
    maxRange: number,
    loanRate: LoanRateInfo[]
}

export type LoanRateInfo = {
    loanType: string,
    newLoanRate: ILoanRate[],
}
