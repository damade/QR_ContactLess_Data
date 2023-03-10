import { Injectable } from '@nestjs/common';
import User, { IUser } from '../model/user.entity';


@Injectable()
export class UsersDatabaseService {

  async user(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async userWithAdditionalFields(uniqueId: any):
    Promise<any | null> {
    return await User.aggregate([
      {$match: {_id: uniqueId}},
      { $group: { _id: "$_id" } },
      {
        $lookup: {
          from: "users", // collection to join
          localField: "_id",//field from the input documents
          foreignField: "_id",//field from the documents of the "from" collection
          as: "user"// output array field
        }
      },
      {
        $lookup: {
          from: "bvns", // collection to join
          localField: "_id",//field from the input documents
          foreignField: "userId",//field from the documents of the "from" collection
          as: "bvnInfo"// output array field
        }
      },
      {
        $lookup: {
          from: "bankaccounts", // collection to join
          localField: "_id",//field from the input documents
          foreignField: "userId",//field from the documents of the "from" collection
          as: "bankInfo"// output array field
        }
      }
    ])
  }

  async userByPhoneNumber(userPhoneNumber: string): Promise<IUser | null> {
    return await User.findOne({ phoneNumber: userPhoneNumber });
  }

  async userByEmail(userEmail: string): Promise<IUser | null> {
    return await User.findOne({ email: userEmail });
  }

  async checkUserByParams(queryParams: object): Promise<IUser | null> {
    return await User.findOne(queryParams);
  }

  async checkUsersByParams(queryParams: object): Promise<IUser[] | null> {
    return await User.find(queryParams);
  }

  async userByPhoneNumberOrEmail(userPhoneNumber: string, userEmail: string): Promise<IUser | null> {
    return await User.findOne({
      $or: [{
        phoneNumber: userPhoneNumber
      }, {
        email: userEmail
      }]
    }
    );
  }

  async userByPhoneNumberOrEmailOrBvn(userPhoneNumber: string, userEmail: string, userBvn: string): Promise<IUser | null> {
    return await User.findOne({
      $or: [{
        phoneNumber: userPhoneNumber,
        email: userEmail,
        bvn: userBvn
      }]
    }
    );
  }

  async users(params: {
    skip?: number;
    limit?: number;
    query?: object;
    orderBy?: object;
  }): Promise<IUser[]> {
    const { skip, limit, query, orderBy } = params;
    return User.find(
      query,
      {
        skip: skip,
        limit: limit,
        sort: orderBy
      },
    );
  }

  async createUser(data: IUser): Promise<IUser> {
    return data.save()
  }

  async updateUser(params: {
    query: object;
    newData: object;
  }): Promise<any> {
    const { query, newData } = params;
    return await User.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    ).then((user: IUser) => {
      return this.userWithAdditionalFields(user._id)
    })
  }

  async updateUserOnly(params: {
    query: object;
    newData: object;
  }): Promise<IUser> {
    const { query, newData } = params;
    return await User.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    )
  }

  async deleteUser(id: string): Promise<IUser> {
    return await User.findByIdAndDelete(id);
  }

  async approvedBankInfos(): Promise<IUser[] | null> {
    return await User.find({ hasAccountBeenApproved: true });
  }

  async unApprovedBankInfos(): Promise<IUser[] | null> {
    return await User.find({ hasAccountBeenApproved: false });
  }

  async approvedBvns(): Promise<IUser[] | null> {
    return await User.find({ hasBvnBeenApproved: true });
  }

  async unApprovedBvns(): Promise<IUser[] | null> {
    return await User.find({ hasBvnBeenApproved: false });
  }

}
