import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import BankAccount, { IBankAccount } from '../model/bank.account.entity';


@Injectable()
export class BankAccountDatabaseService {

  async bankAccountInfo(id: string): Promise<IBankAccount | null> {
    return await BankAccount.findById(id);
  }

  async bankAccountInfoWithBasicUserInfo(uniqueId: string):
    Promise<IBankAccount | null> {
    return await BankAccount.findOne({
      userId: new mongoose.Types.ObjectId(uniqueId)
    }).populate('userId')
  }

  async checkBankInfosByParams(queryParams: object): Promise<IBankAccount[] | null> {
    return await BankAccount.find(queryParams);
  }

  async approveUserBankAccountCreation(uniqueId: string): Promise<IBankAccount> {
    return await BankAccount.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(uniqueId) },
      { isProfileComplete: true}
    )
  }

  async updateUserWalletBalnce(uniqueId: string, newBalance: number): Promise<IBankAccount> {
    return await BankAccount.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(uniqueId) },
      { walletBalance: newBalance}
    )
  }

  async checkBankAccountByParams(queryParams: object): Promise<IBankAccount | null> {
    return await BankAccount.findOne(queryParams);
  }

  async approvedBankInfos(): Promise<IBankAccount[] | null> {
    return await BankAccount.find({ isProfileComplete: true }).populate('userId');
  }

  async unApprovedBankInfos(): Promise<IBankAccount[] | null> {
    return await BankAccount.find({ isProfileComplete: false }).populate('userId');
  }


  async bvns(params: {
    skip?: number;
    limit?: number;
    query?: object;
    orderBy?: object;
  }): Promise<IBankAccount[]> {
    const { skip, limit, query, orderBy } = params;
    return BankAccount.find(
      query,
      {
        skip: skip,
        limit: limit,
        sort: orderBy
      },
    );
  }

  async createBankAccount(data: IBankAccount): Promise<IBankAccount> {
    return data.save()
  }


  async updateBankInfoOnly(params: {
    query: object;
    newData: object;
  }): Promise<IBankAccount> {
    const { query, newData } = params;
    return await BankAccount.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    )
  }

  async updateBankInfoViaUserIdOnly(params: {
    uniqueId: string;
    newData: object;
  }): Promise<IBankAccount> {
    const { uniqueId, newData } = params;
    return await BankAccount.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(uniqueId) },
      newData,
    )
  }

  async deleteBankInfo(id: string): Promise<IBankAccount> {
    return await BankAccount.findByIdAndDelete({ userId: new mongoose.Types.ObjectId(id) });
  }

}
