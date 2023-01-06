import { Injectable } from '@nestjs/common';

import { Guarantor, Prisma, ReferrerInfo, User } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class ReferralPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async referrerInfo(referrerWhereUniqueInput: Prisma.ReferrerInfoWhereUniqueInput):
    Promise<ReferrerInfo | null> {
    return this.prisma.referrerInfo.findUnique({
      where: referrerWhereUniqueInput
    });
  }

  async referrerInfoByReferralCode(referrerWhereUniqueInput: Prisma.ReferrerInfoWhereInput):
    Promise<ReferrerInfo | null> {
    return this.prisma.referrerInfo.findFirst({
      where: referrerWhereUniqueInput,
    });
  }

  async referrerInfosByReferralCode(referrerWhereUniqueInput: Prisma.ReferrerInfoWhereInput):
    Promise<(ReferrerInfo & { user: User })[] | null> {
    return this.prisma.referrerInfo.findMany({
      where: referrerWhereUniqueInput,
      include: {
        user: true,
      },
    });
  }

  async paginatedReferrerInfosByReferralCode(params: {
    page?: number;
    limit?: number;
  },
    referrerWhereUniqueInput: Prisma.ReferrerInfoWhereInput
  ):
    Promise<(ReferrerInfo & { user: User })[] | null> {

      const take = params.limit || 15
      const skip = ((take * params.page) - take) || 0;
      
        return this.prisma.referrerInfo.findMany({
          skip,
          take,
          where: referrerWhereUniqueInput,
          orderBy: {
            updatedAt: 'desc'
         },
          include: {
            user: true,
          },
        });
  }

  async updateReferrerInfo(params: {
    where: Prisma.ReferrerInfoWhereUniqueInput;
    data: Prisma.ReferrerInfoUpdateInput;
  }): Promise<ReferrerInfo | null> {
    const { data, where } = params;
    return this.prisma.referrerInfo.update({
      data,
      where,
    });
  }

  async deleteReferrerInfo(where: Prisma.ReferrerInfoWhereUniqueInput): Promise<ReferrerInfo> {
    return this.prisma.referrerInfo.delete({
      where,
    });
  }
}
