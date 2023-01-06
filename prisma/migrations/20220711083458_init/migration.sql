-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LIVE_USER', 'TEST_USER', 'SYS_ADMIN', 'FINANCE_ADMIN', 'IT_ADMIN', 'CC_ADMIN', 'BT_ADMIN');

-- CreateEnum
CREATE TYPE "SetupStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "LoanTypes" AS ENUM ('Personal', 'Business');

-- CreateEnum
CREATE TYPE "AdminEditStatus" AS ENUM ('Active', 'Inactive', 'Suspended');

-- CreateEnum
CREATE TYPE "LoanRequestStatus" AS ENUM ('Paid', 'Declined', 'Overdue', 'Pending', 'InProgress', 'Temp');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorce');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('Selfemployed', 'Employed', 'Unemployed');

-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('NIN', 'DRIVERSLICENSE', 'INTERNATIONALPASSPORT', 'VOTERSCARD');

-- CreateEnum
CREATE TYPE "ReferralSurvey" AS ENUM ('Family', 'Friend', 'Twitter', 'WhatsApp', 'Instagram', 'Facebook', 'Others', 'None', 'Google', 'Linkedln');

-- CreateEnum
CREATE TYPE "LoanTier" AS ENUM ('Tier0', 'Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5', 'None', 'Custom');

-- CreateEnum
CREATE TYPE "LoanEligibilityIssue" AS ENUM ('Profile', 'EmploymentProfile', 'BusinessProfile', 'NoBankDetails', 'NoDebitBankDetails', 'WrongBusinessNameDetails', 'WrongRcNumber', 'GuarantorProfile', 'OldDebt', 'NoCreditScore', 'LowCreditScore', 'Custom', 'None');

-- CreateEnum
CREATE TYPE "CreditScoreRate" AS ENUM ('Excellent', 'Better', 'Good', 'Fair', 'Poor', 'Bad');

-- CreateEnum
CREATE TYPE "IssueCategory" AS ENUM ('LoanApplication', 'LoanRepayment', 'LoanDisbursement', 'Enquiries');

-- CreateEnum
CREATE TYPE "IssueResolutionStatus" AS ENUM ('Resolved', 'Resolving', 'NotResolved');

-- CreateEnum
CREATE TYPE "BusinessSector" AS ENUM ('Agriculture', 'Aviation', 'Commercial_Retail', 'Construction', 'Education_Training', 'Energy_PowerGeneration', 'FMCG', 'Fashion', 'FinancialServices', 'Ict', 'Haulage_Logistics', 'Healthcare', 'Mining', 'Media_Entertainment', 'Oil_Gas', 'ProfessionalServices', 'Telecommunication', 'Tourism_Hospitality', 'Transportation', 'WasteManagement', 'Others');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(45) NOT NULL,
    "lastName" VARCHAR(45) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "maritalStatus" "MaritalStatus",
    "identificationType" "IdentificationType",
    "identityUrl" TEXT,
    "signatureUrl" TEXT,
    "bvn" TEXT NOT NULL,
    "bvnIndex" TEXT NOT NULL,
    "nin" TEXT,
    "ninIndex" TEXT,
    "pin" TEXT NOT NULL,
    "userImage" TEXT,
    "referralCode" TEXT NOT NULL,
    "currentLoanBalance" INTEGER NOT NULL DEFAULT 0,
    "walletBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT E'TEST_USER',
    "bearerToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(45) NOT NULL,
    "lastName" VARCHAR(45) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'TEST_USER',
    "bearerToken" TEXT,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AdminEditStatus" NOT NULL DEFAULT E'Suspended',
    "adminUserId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanInfo" (
    "id" SERIAL NOT NULL,
    "uniqueId" VARCHAR(12) NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "loanType" "LoanTypes" NOT NULL,
    "interestAmount" INTEGER NOT NULL,
    "loanTenure" TEXT NOT NULL,
    "loanTenureInMonths" INTEGER NOT NULL,
    "reasonForLoan" TEXT,
    "totalLoanAmount" INTEGER NOT NULL,
    "loanAmountDue" INTEGER NOT NULL,
    "loanInterest" INTEGER NOT NULL,
    "loanStatus" "LoanRequestStatus" NOT NULL,
    "comment" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "loanDueDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "approvedBy" INTEGER,
    "cardId" INTEGER,
    "bankDetailsId" INTEGER,

    CONSTRAINT "LoanInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanEligibility" (
    "id" SERIAL NOT NULL,
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "hasPendingLoan" BOOLEAN NOT NULL DEFAULT false,
    "issues" "LoanEligibilityIssue"[],
    "reasonForIssues" TEXT,
    "currentTier" "LoanTier" NOT NULL DEFAULT E'None',
    "creditScore" INTEGER,
    "creditScoreRate" "CreditScoreRate",
    "creditScoreUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "internalCreditScore" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoanEligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issues" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "issueCategory" "IssueCategory" NOT NULL,
    "issueResolutionStatus" "IssueResolutionStatus" NOT NULL DEFAULT E'Resolving',
    "remark" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" SERIAL NOT NULL,
    "nuban" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "nubanCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardDetails" (
    "id" SERIAL NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "cardBank" TEXT,
    "accountName" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "reusable" BOOLEAN NOT NULL DEFAULT false,
    "authorizationCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddCardDetails" (
    "id" SERIAL NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "isSuccessful" BOOLEAN NOT NULL DEFAULT false,
    "dateEntered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AddCardDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferrerInfo" (
    "id" SERIAL NOT NULL,
    "surveyType" "ReferralSurvey",
    "surveyTypeOther" TEXT,
    "referrer" TEXT,
    "isVestable" BOOLEAN NOT NULL DEFAULT false,
    "hasBeenPaid" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReferrerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressInfo" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "landMark" TEXT,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AddressInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentProfile" (
    "id" SERIAL NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "employersName" TEXT,
    "companyAddress" TEXT,
    "payDay" TIMESTAMP(3),
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "monthlyIncome" INTEGER,
    "unEmploymentDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EmploymentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "approvalStatus" "SetupStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Guarantor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" SERIAL NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessSector" "BusinessSector" NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "monthlyTurnover" INTEGER NOT NULL,
    "businessPhoneNumber" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "remark" TEXT,
    "isBusinessRegistered" BOOLEAN NOT NULL,
    "rcNumber" TEXT,
    "isRcNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "cacUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_adminUserId_key" ON "Department"("adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "LoanEligibility_userId_key" ON "LoanEligibility"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_userId_key" ON "BankDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerInfo_userId_key" ON "ReferrerInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AddressInfo_userId_key" ON "AddressInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentProfile_userId_key" ON "EmploymentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guarantor_userId_key" ON "Guarantor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInfo" ADD CONSTRAINT "LoanInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInfo" ADD CONSTRAINT "LoanInfo_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInfo" ADD CONSTRAINT "LoanInfo_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanInfo" ADD CONSTRAINT "LoanInfo_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanEligibility" ADD CONSTRAINT "LoanEligibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDetails" ADD CONSTRAINT "CardDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddCardDetails" ADD CONSTRAINT "AddCardDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferrerInfo" ADD CONSTRAINT "ReferrerInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressInfo" ADD CONSTRAINT "AddressInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentProfile" ADD CONSTRAINT "EmploymentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guarantor" ADD CONSTRAINT "Guarantor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
