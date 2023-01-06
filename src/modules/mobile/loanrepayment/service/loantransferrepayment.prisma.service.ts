import { Injectable, NotFoundException } from '@nestjs/common';

import {LoanTransferRepayment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class LoanTransferRepaymentPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async loanTransferRepayment(loanRepaymentUniqueInput: Prisma.LoanTransferRepaymentWhereUniqueInput):
    Promise<LoanTransferRepayment | null> {
    return this.prisma.loanTransferRepayment.findUnique ({
      where: loanRepaymentUniqueInput,
      rejectOnNotFound:  (err) => new NotFoundException(`Loan Repayment with Id ${loanRepaymentUniqueInput.id} was not found`) 
    });
  }
  
  async loanTransferRepaymentByUserId(userIdUniqueInput: Prisma.LoanTransferRepaymentWhereInput):
    Promise<LoanTransferRepayment[] | null> {
    return this.prisma.loanTransferRepayment.findMany({
      where: userIdUniqueInput,
    });
  }

  async loanTransferRepaymentByQuery(loanReplaymentInput: Prisma.LoanTransferRepaymentWhereInput):
    Promise<LoanTransferRepayment[] | null> {
    return this.prisma.loanTransferRepayment.findMany({
      where: loanReplaymentInput
    });
  }

  async paginatedTransferRepaymentByUserId(params: {
    page?: number;
    limit?: number;
  },
    userIdUniqueInput: Prisma.LoanTransferRepaymentWhereInput
  ):
    Promise<LoanTransferRepayment[] | null> {

      const take = params.limit || 15
      const skip = (((take * params.page) - take) > 0) ? ((take * params.page) - take) : 0;
      
        return this.prisma.loanTransferRepayment.findMany({
          skip,
          take,
          where: userIdUniqueInput,
          orderBy: {
            sentAt: 'desc'
         },
        });
  }


  async paginatedTransferRepaymentByQuery(params: {
    page?: number;
    limit?: number;
  },
    loanReplaymentInput: Prisma.LoanTransferRepaymentWhereInput
  ):
    Promise<LoanTransferRepayment[] | null> {

      const take = params.limit || 15
      const skip = ((take * params.page) - take) || 0;
      
        return this.prisma.loanTransferRepayment.findMany({
          skip,
          take,
          where: loanReplaymentInput,
          orderBy: {
            sentAt: 'desc'
         },
        });
  }

  async createTransferRepayment(data: Prisma.LoanTransferRepaymentCreateInput): Promise<LoanTransferRepayment> {
    return this.prisma.loanTransferRepayment.create({
      data,
    });
  }

  async updateTransferRepayment(params: {
    where: Prisma.LoanTransferRepaymentWhereUniqueInput;
    data: Prisma.LoanTransferRepaymentUpdateInput;
  }): Promise<LoanTransferRepayment> {
    const { data, where } = params;
    return this.prisma.loanTransferRepayment.update({
      data,
      where,
    });
  }

  async deleteTransferRepayment(where: Prisma.LoanTransferRepaymentWhereUniqueInput): Promise<LoanTransferRepayment> {
    return this.prisma.loanTransferRepayment.delete({
      where,
    });
  }

}
