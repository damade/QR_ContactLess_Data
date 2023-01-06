import { Injectable } from '@nestjs/common';

import { LoanInfo, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class LoanInfoPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async loanInfo(loanInfoWhereUniqueInput: Prisma.LoanInfoWhereUniqueInput):
    Promise<LoanInfo | null> {
    return this.prisma.loanInfo.findUnique({
      where: loanInfoWhereUniqueInput
    });
  }

  async loanInfos(loanInfoWhereUniqueInput: Prisma.LoanInfoWhereInput):
    Promise<LoanInfo[] | null> {
    return this.prisma.loanInfo.findMany({
      where: loanInfoWhereUniqueInput
    });
  }

  async paginatedWebLoanInfo(params: {
    page?: number;
    limit?: number;
  },
    loanInfoWhereUniqueInput: Prisma.LoanInfoWhereInput
  ):
    Promise<(LoanInfo & { user: User })[] | null> {

      const take = params.limit || 15
      const skip = ((take * params.page) - take) || 0;
      
        return this.prisma.loanInfo.findMany({
          skip,
          take,
          where: loanInfoWhereUniqueInput,
          orderBy: {
            appliedAt: 'desc'
         },
          include: {
            user: true,
          },
        });
  }

  async paginatedLoanInfo(params: {
    page?: number;
    limit?: number;
  },
    loanInfoWhereUniqueInput: Prisma.LoanInfoWhereInput
  ):
    Promise<LoanInfo[] | null> {

      const take = params.limit || 15
      const skip = ((take * params.page) - take) || 0;
      
        return this.prisma.loanInfo.findMany({
          skip,
          take,
          where: loanInfoWhereUniqueInput,
          orderBy: {
            appliedAt: 'desc'
         },
          include: {
            user: true,
          },
        });
  }

  async createLoanInfo(data: Prisma.LoanInfoCreateInput): Promise<LoanInfo> {
    return this.prisma.loanInfo.create({
      data,
    });
  }

  async updateLoanInfo(params: {
    where: Prisma.LoanInfoWhereUniqueInput;
    data: Prisma.LoanInfoUpdateInput;
  }): Promise<LoanInfo | null> {
    const { data, where } = params;
    return this.prisma.loanInfo.update({
      data,
      where,
    });
  }

  async deleteReferrerInfo(where: Prisma.LoanInfoWhereUniqueInput): Promise<LoanInfo> {
    return this.prisma.loanInfo.delete({
      where,
    });
  }
}
