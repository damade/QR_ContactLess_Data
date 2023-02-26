import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import Bvn, { IBvn } from '../model/bvn.entity';


@Injectable()
export class BvnDatabaseService {

  async bvnInfo(id: string): Promise<IBvn | null> {
    return await Bvn.findById(id);
  }

  async bvnInfoWithBasicUserInfo(uniqueId: string):
    Promise<IBvn | null> {
    return await Bvn.findOne({
      userId: new mongoose.Types.ObjectId(uniqueId)
    }).populate('userId')
  }

  async checkBvnsByParams(queryParams: object): Promise<IBvn[] | null> {
    return await Bvn.find(queryParams);
  }

  async approveUserBvnCreation(uniqueId: string): Promise<IBvn> {
    return await Bvn.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(uniqueId) },
      { isApproved: true }
    )
  }

  async checkBvnByParams(queryParams: object): Promise<IBvn | null> {
    return await Bvn.findOne(queryParams);
  }

  async approvedBvnInfos(): Promise<IBvn[] | null> {
    return await Bvn.find({ isApproved: true }).populate('userId');
  }

  async unApprovedBvnInfos(): Promise<IBvn[] | null> {
    return await Bvn.find({ isApproved: false }).populate('userId');
  }


  async bvns(params: {
    skip?: number;
    limit?: number;
    query?: object;
    orderBy?: object;
  }): Promise<IBvn[]> {
    const { skip, limit, query, orderBy } = params;
    return Bvn.find(
      query,
      {
        skip: skip,
        limit: limit,
        sort: orderBy
      },
    );
  }

  async createBvn(data: IBvn): Promise<IBvn> {
    return (await data.save()).populate('userId')
  }


  async updateBvnOnly(params: {
    query: object;
    newData: object;
  }): Promise<IBvn> {
    const { query, newData } = params;
    return await Bvn.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    )
  }

  async deleteBvn(id: string): Promise<IBvn> {
    return await Bvn.findByIdAndDelete({ userId: new mongoose.Types.ObjectId(id) });
  }

}
