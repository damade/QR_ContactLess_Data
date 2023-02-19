import { AddressDto } from "../dto/address.dto";
import { UserDto } from "../dto/user.dto";
import User, { IUser } from "../model/user.entity";

export function mapToUser(userModel: UserDto): IUser {
    return new User({
        uniqueId: userModel.uniqueId,
        phoneNumber: userModel.phoneNumber,
        email: userModel.email,
        title: userModel.title,
        firstName: userModel.firstName,
        lastName: userModel.lastName,
        middleName: userModel.middleName,
        fullName: userModel.firstName + " " + userModel.lastName,
        dateOfBirth: userModel.dateOfBirth,
        gender: userModel.gender,
        stateOfOrigin: userModel.stateOfOrigin,
        lgaOfOrigin: userModel.lgaOfOrigin,
        placeOfBirth: userModel.placeOfBirth,
        nationality: userModel.nationality,
        maritalStatus: userModel.maritalStatus,
        identitifcationType: userModel.identificationType,
        idCardNo: userModel.idCardNo,
        signatureUrl: userModel.signatureUrl,
        password: userModel.password,
        address: userModel.address.address,
        city: userModel.address.city,
        lga: userModel.address.lga,
        landmark: userModel.address.landmark,
        state: userModel.address.state,
        isCreatingAccount: userModel.isCreatingAccount,
        isCreatingBvn: userModel.isCreatingBvn
    })
}