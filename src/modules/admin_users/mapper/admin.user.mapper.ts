
import { AdminUserDto } from "../dto/admin.user.dto";
import AdminUser, { IAdminUser } from "../model/admin.user.entity";

export function mapToAdminUser(userModel: AdminUserDto): IAdminUser {
    return new AdminUser({
        uniqueId: userModel.uniqueId,
        phoneNumber: userModel.phoneNumber,
        email: userModel.email,
        title: userModel.title,
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        fullName: userModel.firstName + " " + userModel.lastName,
        gender: userModel.gender,
        bankBranch: userModel.bankBranch,
        password: userModel.password,
    })
}