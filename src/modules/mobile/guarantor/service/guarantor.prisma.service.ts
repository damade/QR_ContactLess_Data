import { Injectable } from '@nestjs/common';

import { Guarantor, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class GuarantorPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async guarantorInfo(guarantorWhereUniqueInput: Prisma.GuarantorWhereUniqueInput):
       Promise<Guarantor | null> {
    return this.prisma.guarantor.findUnique({
      where: guarantorWhereUniqueInput
    });
  }

  async guarantorInfoByUserId(guarantorWhereUniqueInput: Prisma.GuarantorWhereInput): 
      Promise<Guarantor| null> {
    return this.prisma.guarantor.findFirst({
      where: guarantorWhereUniqueInput,
    });
  }

  async createGuarantorInfo(data: Prisma.GuarantorCreateInput): Promise<Guarantor> {
    return this.prisma.guarantor.create({
      data,
    });
  }

  async updateGuarantorInfo(params: {
    where: Prisma.GuarantorWhereUniqueInput;
    data: Prisma.GuarantorUpdateInput;
  }): Promise<Guarantor> {
    const { data, where } = params;
    return this.prisma.guarantor.update({
      data,
      where,
    });
  }

  async deleteGuarantorInfo(where: Prisma.GuarantorWhereUniqueInput): Promise<Guarantor> {
    return this.prisma.guarantor.delete({
      where,
    });
  }
}
