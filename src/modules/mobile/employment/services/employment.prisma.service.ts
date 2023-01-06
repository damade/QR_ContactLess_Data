import { Injectable } from '@nestjs/common';

import { EmploymentProfile, EmploymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class EmploymentPrismaService {

  constructor(private readonly prisma: PrismaService) { }

  async employmentProfile(employmentWhereUniqueInput: Prisma.EmploymentProfileWhereUniqueInput):
       Promise<EmploymentProfile | null> {
    return this.prisma.employmentProfile.findUnique({
      where: employmentWhereUniqueInput
    });
  }

  async employmentProfileByUserId(employmentProfileWhereUniqueInput: Prisma.EmploymentProfileWhereInput): 
      Promise<EmploymentProfile| null> {
    return this.prisma.employmentProfile.findFirst({
      where: employmentProfileWhereUniqueInput,
    });
  }
  async employmentProfiles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EmploymentProfileWhereUniqueInput;
    where?: Prisma.EmploymentProfileWhereInput;
    orderBy?: Prisma.EmploymentProfileOrderByWithRelationInput;
  }): Promise<EmploymentProfile[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.employmentProfile.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createEmploymentProfile(data: Prisma.EmploymentProfileCreateInput): Promise<EmploymentProfile> {
    return this.prisma.employmentProfile.create({
      data,
    });
  }

  async updateEmploymentProfile(params: {
    where: Prisma.EmploymentProfileWhereUniqueInput;
    data: Prisma.EmploymentProfileUpdateInput;
  }): Promise<EmploymentProfile> {
    const { data, where } = params;
    return this.prisma.employmentProfile.update({
      data,
      where,
    });
  }

  async deleteEmploymentProfile(where: Prisma.EmploymentProfileWhereUniqueInput): Promise<EmploymentProfile> {
    return this.prisma.employmentProfile.delete({
      where,
    });
  }
}
