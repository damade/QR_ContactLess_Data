import { Injectable, NotFoundException } from '@nestjs/common';

import {LoanInfo, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';
import { LoanHistoryPreview } from '../model/loanhistory.mobile.info';

@Injectable()
export class LoanHistoryPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async loanInfo(loanInfoWhereUniqueInput: Prisma.LoanInfoWhereUniqueInput):
    Promise<LoanInfo | null> {
    return this.prisma.loanInfo.findUnique({
      where: loanInfoWhereUniqueInput
    });
  }

  async loanInfoPreview(loanInfoWhereUniqueInput: Prisma.LoanInfoWhereUniqueInput):
    Promise<LoanHistoryPreview | null> {
    return this.prisma.loanInfo.findUnique ({
      where: loanInfoWhereUniqueInput,
      select:{
        id: true,
        uniqueId: true,
        loanAmount: true,
        loanType: true,
        loanStatus: true,
        loanTenure: true,
        loanTenureInMonths: true,
        approvedAt: true,
        loanDueDate: true
      },
      rejectOnNotFound:  (err) => new NotFoundException(`Loan with uniqueId ${loanInfoWhereUniqueInput.uniqueId} was not found`) 
    });
  }

  async loanHistoryByUserId(userIdUniqueInput: Prisma.LoanInfoWhereInput):
    Promise<LoanInfo | null> {
    return this.prisma.loanInfo.findFirst({
      where: userIdUniqueInput,
    });
  }

  async loanHistoriesByUserId(userIdUniqueInput: Prisma.LoanInfoWhereInput):
    Promise<LoanInfo[] | null> {
    return this.prisma.loanInfo.findMany({
      where: userIdUniqueInput
    });
  }

  async loanHistoriesPreviewByUserId(userIdUniqueInput: Prisma.LoanInfoWhereInput):
    Promise<LoanHistoryPreview[] | null> {
    return this.prisma.loanInfo.findMany({
      where: userIdUniqueInput,
      select:{
        id: true,
        uniqueId: true,
        loanAmount: true,
        loanType: true,
        loanStatus: true,
        loanTenure: true,
        loanTenureInMonths: true,
        approvedAt: true,
        loanDueDate: true
      },

    });
  }

  async loanHistoriesByQuery(loanInfoInput: Prisma.LoanInfoWhereInput):
    Promise<LoanInfo[] | null> {
    return this.prisma.loanInfo.findMany({
      where: loanInfoInput
    });
  }

  async paginatedLoanHistoriesByUserId(params: {
    page?: number;
    limit?: number;
  },
    userIdUniqueInput: Prisma.LoanInfoWhereInput
  ):
    Promise<LoanInfo[] | null> {

      const take = params.limit || 15
      const skip = (((take * params.page) - take) > 0) ? ((take * params.page) - take) : 0;
      
        return this.prisma.loanInfo.findMany({
          skip,
          take,
          where: userIdUniqueInput,
          orderBy: {
            editedAt: 'desc'
         },
        });
  }

  async paginatedLoanHistoriesPreviewByUserId(params: {
    page?: number;
    limit?: number;
  },
    userIdUniqueInput: Prisma.LoanInfoWhereInput
  ):
    Promise<LoanHistoryPreview[] | null> {

      const take = params.limit || 15
      const skip = (((take * params.page) - take) > 0) ? ((take * params.page) - take) : 0;
      
        return this.prisma.loanInfo.findMany({
          skip,
          take,
          where: userIdUniqueInput,
          select:{
            id: true,
            uniqueId: true,
            loanAmount: true,
            loanType: true,
            loanStatus: true,
            loanTenure: true,
            loanTenureInMonths: true,
            approvedAt: true,
            loanDueDate: true
          },
          orderBy: {
            editedAt: 'desc'
         },
        });
  }


  async paginatedLoanHistoriesByQuery(params: {
    page?: number;
    limit?: number;
  },
    loanInfoInput: Prisma.LoanInfoWhereInput
  ):
    Promise<LoanInfo[] | null> {

      const take = params.limit || 15
      const skip = ((take * params.page) - take) || 0;
      
        return this.prisma.loanInfo.findMany({
          skip,
          take,
          where: loanInfoInput,
          orderBy: {
            editedAt: 'desc'
         },
        });
  }


}