import { Injectable } from '@nestjs/common';

import { AddCardDetails, BankDetails, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class AddCardDetailsPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async addCardDetailInfo(addCardDetailsWhereUniqueInput: Prisma.AddCardDetailsWhereUniqueInput):
       Promise<AddCardDetails | null> {
    return this.prisma.addCardDetails.findUnique({
      where: addCardDetailsWhereUniqueInput
    });
  }

  async addCardDetailInfoByUserId(addCardDetailsWhereInput: Prisma.AddCardDetailsWhereInput): 
      Promise<AddCardDetails[] | null> {
    return this.prisma.addCardDetails.findMany({
      where: addCardDetailsWhereInput
    });
  }

  async createAddCardDetailsInfo(data: Prisma.AddCardDetailsCreateInput): Promise<AddCardDetails> {
    return this.prisma.addCardDetails.create({
      data,
    });
  }

  async updateAddCardDetailsInfo(params: {
    where: Prisma.AddCardDetailsWhereUniqueInput;
    data: Prisma.AddCardDetailsUpdateInput;
  }): Promise<AddCardDetails> {
    const { data, where } = params;
    return this.prisma.addCardDetails.update({
      data,
      where,
    });
  }

  async deleteAddCardInfo(where: Prisma.AddCardDetailsWhereUniqueInput): Promise<AddCardDetails> {
    return this.prisma.addCardDetails.delete({
      where,
    });
  }
}
