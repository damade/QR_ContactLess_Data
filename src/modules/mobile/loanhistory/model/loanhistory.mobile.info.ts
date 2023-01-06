import { LoanRequestStatus, LoanTypes } from "@prisma/client"

export type LoanHistoryPreview = {
    id: Number,
    uniqueId: String,   
    loanAmount: Number,
    loanType: LoanTypes,
    loanTenure: String,
    loanTenureInMonths: Number,
    loanStatus: LoanRequestStatus,
    approvedAt?:  Date
    loanDueDate?: Date
}
