import { Injectable } from '@nestjs/common';

import { BankDetails, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class BankDetailsPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async bankDetailInfo(bankDetailsWhereUniqueInput: Prisma.BankDetailsWhereUniqueInput):
       Promise<BankDetails | null> {
    return this.prisma.bankDetails.findUnique({
      where: bankDetailsWhereUniqueInput
    });
  }

  async bankDetailInfoByUserId(bankDetailsWhereUniqueInput: Prisma.BankDetailsWhereInput): 
      Promise<BankDetails| null> {
    return this.prisma.bankDetails.findFirst({
      where: bankDetailsWhereUniqueInput,
    });
  }

  async createBankDetailsInfo(data: Prisma.BankDetailsCreateInput): Promise<BankDetails> {
    return this.prisma.bankDetails.create({
      data,
    });
  }

  async updateBankDetailsInfo(params: {
    where: Prisma.BankDetailsWhereUniqueInput;
    data: Prisma.BankDetailsUpdateInput;
  }): Promise<BankDetails> {
    const { data, where } = params;
    return this.prisma.bankDetails.update({
      data,
      where,
    });
  }

  async deleteGuarantorInfo(where: Prisma.BankDetailsWhereUniqueInput): Promise<BankDetails> {
    return this.prisma.bankDetails.delete({
      where,
    });
  }
}
