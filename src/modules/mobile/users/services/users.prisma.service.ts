import { Injectable } from '@nestjs/common';

import { User, Prisma, LoanEligibility, AddressInfo, EmploymentProfile, Guarantor } from '@prisma/client';
import { PrismaService } from 'src/core/database/service/PrismaService';

@Injectable()
export class UsersPrismaService {

  constructor(readonly prisma: PrismaService) { }

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async userWithAdditionalFields(userWhereUniqueInput: Prisma.UserWhereUniqueInput):
   Promise<User  & { loanEligibility: LoanEligibility, addressInfo: AddressInfo
    employmentInfo: EmploymentProfile, guarantor: Guarantor} | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include:{
        loanEligibility: true,
        addressInfo: true,
        employmentInfo: true,
        guarantor: true,
      }
    });
  }

  async userByPhoneNumber(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async userByEmail(userWhereUniqueInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: userWhereUniqueInput,
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async checkUserByParams(userWhereUniqueInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: userWhereUniqueInput,
    });
  }

  async checkUsersByParams(userWhereUniqueInput: Prisma.UserWhereInput): Promise<User[] | null> {
    return this.prisma.user.findMany({
      where: userWhereUniqueInput,
    });
  }

  async userByPhoneNumberOrEmail(userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userWhereOtherUniqueInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          userWhereUniqueInput,
          userWhereOtherUniqueInput,
        ]
      },
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async userByPhoneNumberOrEmailOrBvn(userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userWhereOtherUniqueInput: Prisma.UserWhereInput, 
    userWhereOtherInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          userWhereUniqueInput,
          userWhereOtherUniqueInput,
          userWhereOtherInput
        ]
      },
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;
    return this.prisma.user.update({
      data,
      where,
      include:{
        loanEligibility: true,
        addressInfo: true
      }
    });
  }

  async updateUserOnly(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  
}
