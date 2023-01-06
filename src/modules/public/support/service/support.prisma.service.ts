import { Injectable } from '@nestjs/common';

import { Issues, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class SupportPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async supportInfo(issuesWhereUniqueInput: Prisma.IssuesWhereUniqueInput):
       Promise<Issues | null> {
    return this.prisma.issues.findUnique({
      where: issuesWhereUniqueInput
    });
  }

  async supportInfosByUserId(issuesWhereUniqueInput: Prisma.IssuesWhereInput): 
      Promise< Issues[]| null> {
    return this.prisma.issues.findMany({
      where: issuesWhereUniqueInput,
    });
  }

  async supportInfos(): 
      Promise< Issues[]| null> {
    return this.prisma.issues.findMany({
    });
  }

  async createSupportInfo(data: Prisma.IssuesCreateInput): Promise<Issues> {
    return this.prisma.issues.create({
      data,
    });
  }

  async updateSupportInfo(params: {
    where: Prisma.IssuesWhereUniqueInput;
    data: Prisma.IssuesUpdateInput;
  }): Promise<Issues> {
    const { data, where } = params;
    return this.prisma.issues.update({
      data,
      where,
    });
  }

  async deleteSupportInfo(where: Prisma.IssuesWhereUniqueInput): Promise<Issues> {
    return this.prisma.issues.delete({
      where,
    });
  }
}
