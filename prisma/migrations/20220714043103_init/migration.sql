/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `LoanInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LoanInfo_uniqueId_key" ON "LoanInfo"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
