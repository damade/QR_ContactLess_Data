import { Injectable } from '@nestjs/common';
import AdminUser, { IAdminUser } from '../model/admin.user.entity';


@Injectable()
export class AdminUsersDatabaseService {

  async adminUser(id: string): Promise<IAdminUser | null> {
    return await AdminUser.findById(id);
  }

  async userByPhoneNumber(userPhoneNumber: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({ phoneNumber: userPhoneNumber });
  }

  async userByEmail(userEmail: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({ email: userEmail });
  }

  async checkUserByParams(queryParams: object): Promise<IAdminUser | null> {
    return await AdminUser.findOne(queryParams);
  }

  async checkUsersByParams(queryParams: object): Promise<IAdminUser[] | null> {
    return await AdminUser.find(queryParams);
  }

  async userByPhoneNumberOrEmail(userPhoneNumber: string, userEmail: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({
      $or: [{
        phoneNumber: userPhoneNumber
      }, {
        email: userEmail
      }]
    }
    );
  }

  async userByPhoneNumberOrEmailOrStaffId(userPhoneNumber: string, userEmail: string, staffId: string): Promise<IAdminUser | null> {
    return await AdminUser.findOne({
      $or: [{
        phoneNumber: userPhoneNumber
      }, {
        email: userEmail
      }, {
        staffId
      }]
    }
    );
  }

  async users(params: {
    skip?: number;
    limit?: number;
    query?: object;
    orderBy?: object;
  }): Promise<IAdminUser[]> {
    const { skip, limit, query, orderBy } = params;
    return AdminUser.find(
      query,
      {
        skip: skip,
        limit: limit,
        sort: orderBy
      },
    );
  }

  async createUser(data: IAdminUser): Promise<IAdminUser> {
    return data.save()
  }

  async updateUser(params: {
    query: object;
    newData: object;
  }): Promise<any> {
    const { query, newData } = params;
    return await AdminUser.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    ).then((adminUser: IAdminUser) => {
      return this.adminUser(adminUser._id)
    })
  }

  async updateUserOnly(params: {
    query: object;
    newData: object;
  }): Promise<IAdminUser> {
    const { query, newData } = params;
    return await AdminUser.findOneAndUpdate(
      query,
      newData,
      { upsert: true }
    )
  }

  async deleteUser(id: string): Promise<IAdminUser> {
    return await AdminUser.findByIdAndDelete(id);
  }

}
