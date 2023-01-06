import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { BankDetails, CardDetails, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class CardDetailsPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async cardDetailInfo(cardDetailsWhereUniqueInput: Prisma.CardDetailsWhereUniqueInput):
       Promise<CardDetails| null> {
    return this.prisma.cardDetails.findUnique({
      where: cardDetailsWhereUniqueInput
    });
  }

  async cardDetailsInfoByUserId(cardDetailsWhereInput: Prisma.CardDetailsWhereInput): 
      Promise<CardDetails[]| null> {
    return this.prisma.cardDetails.findMany({
      where: cardDetailsWhereInput,
    });
  }

  async cardDetailInfoByUserId(cardDetailsWhereInput: Prisma.CardDetailsWhereInput): 
      Promise<CardDetails| null> {
    return this.prisma.cardDetails.findFirst({
      where: cardDetailsWhereInput,
    });
  }

  async createCardDetailsInfo(data: Prisma.CardDetailsCreateInput): Promise<CardDetails> {
    return this.prisma.cardDetails.create({
      data,
    });
  }

  async updateCardDetailsInfo(params: {
    where: Prisma.CardDetailsWhereUniqueInput;
    data: Prisma.CardDetailsUpdateInput;
  }): Promise<CardDetails> {
    const { data, where } = params;
    return this.prisma.cardDetails.update({
      data,
      where,
    });
  }

  async deleteCardDetailsInfo(where: Prisma.CardDetailsWhereUniqueInput): Promise<CardDetails> {
    return this.prisma.cardDetails.delete({
      where,
    });
  }

  async makeDefaultCard(customerId: number, last4: string): Promise<CardDetails> {

   return await this.prisma.$transaction(async (prisma: PrismaService) => {
      
      //1. Check if User has Card Info
      const userCards = await this.cardDetailInfoByUserId({userId: customerId})
      if (!userCards) {
        throw new HttpException("You have no card to make default", HttpStatus.UNPROCESSABLE_ENTITY)
      }

      // 2. Set All Existing Cards To Not Default.
      await prisma.cardDetails.updateMany({
        where: {
          userId: customerId,
        },
        data: {
          isDefault: false
        },
      })

      // 3. Verify that the card detail exist.
      const theCard = await this.cardDetailInfoByUserId({userId: customerId, last4})
      if (!theCard) {
        throw new HttpException("You have no card to make default", HttpStatus.UNPROCESSABLE_ENTITY)
      }

      // 4. Make card the default card.
      return prisma.cardDetails.update({
        where: {
          id: theCard.id,
        },
        data: {
          isDefault: true
        },
      })
    })
  }
}
