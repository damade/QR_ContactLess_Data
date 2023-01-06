import { Injectable } from '@nestjs/common';

import { LoanEligibility, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class EligibilityPrismaService {

  constructor(readonly prisma: PrismaService) { }

  async loanEligibility(loanEligibityWhereUniqueInput: Prisma.LoanEligibilityWhereUniqueInput):
       Promise<LoanEligibility | null> {
    return this.prisma.loanEligibility.findUnique({
      where: loanEligibityWhereUniqueInput
    });
  }

  async loanEligibilityByUserId(loanEligibilityWhereUniqueInput: Prisma.LoanEligibilityWhereInput): 
      Promise<LoanEligibility| null> {
    return this.prisma.loanEligibility.findFirst({
      where: loanEligibilityWhereUniqueInput,
    });
  }
  
  async updateLoanEligibility(params: {
    where: Prisma.LoanEligibilityWhereUniqueInput;
    data: Prisma.LoanEligibilityUpdateInput;
  }): Promise<LoanEligibility> {
    const { data, where } = params;
    return this.prisma.loanEligibility.update({
      data,
      where,
    });
  }

}
