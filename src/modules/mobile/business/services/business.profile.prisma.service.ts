import { Injectable } from '@nestjs/common';

import { BusinessProfile, EmploymentProfile, EmploymentStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class BusinessProfilePrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async businessProfile(businessWhereUniqueInput: Prisma.BusinessProfileWhereUniqueInput):
       Promise<BusinessProfile | null> {
    return this.prisma.businessProfile.findUnique({
      where: businessWhereUniqueInput
    });
  }

  async businessProfileByUserId(businessProfileWhereUniqueInput: Prisma.BusinessProfileWhereInput): 
      Promise<BusinessProfile| null> {
    return this.prisma.businessProfile.findFirst({
      where: businessProfileWhereUniqueInput,
    });
  }

  async businessProfileWithUserIdByUserId(businessProfileWhereUniqueInput: Prisma.BusinessProfileWhereInput): 
      Promise<(BusinessProfile  & { user: User }) | null> {
    return this.prisma.businessProfile.findFirst({
      where: businessProfileWhereUniqueInput,
      include: {
        user: {
          include:{
            loanEligibility: true
          }
        }
      },
    });
  }

  async businessProfiles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BusinessProfileWhereUniqueInput;
    where?: Prisma.BusinessProfileWhereInput;
    orderBy?: Prisma.BusinessProfileOrderByWithRelationInput;
  }): Promise<BusinessProfile[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.businessProfile.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createBusinessProfile(data: Prisma.BusinessProfileCreateInput): Promise<BusinessProfile> {
    return this.prisma.businessProfile.create({
      data,
    });
  }

  async updateBusinessProfile(params: {
    where: Prisma.BusinessProfileWhereUniqueInput;
    data: Prisma.BusinessProfileUpdateInput;
  }): Promise<BusinessProfile> {
    const { data, where } = params;
    return this.prisma.businessProfile.update({
      data,
      where,
    });
  }

  async deleteBusinessProfile(where: Prisma.BusinessProfileWhereUniqueInput): Promise<BusinessProfile> {
    return this.prisma.businessProfile.delete({
      where,
    });
  }
}
