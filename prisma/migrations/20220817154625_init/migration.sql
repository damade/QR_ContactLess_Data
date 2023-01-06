-- CreateTable
CREATE TABLE "LoanTransferRepayment" (
    "id" SERIAL NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "repaymentAmount" INTEGER NOT NULL,
    "receiptUrl" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedOrDeclinedAt" TIMESTAMP(3),
    "loanId" TEXT NOT NULL,

    CONSTRAINT "LoanTransferRepayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanTransferRepayment" ADD CONSTRAINT "LoanTransferRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanInfo"("uniqueId") ON DELETE RESTRICT ON UPDATE CASCADE;
