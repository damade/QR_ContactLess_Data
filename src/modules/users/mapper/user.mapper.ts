import { AddressDto } from "../dto/address.dto";
import { UserDto } from "../dto/user.dto";
import Address, { IAddress } from "../model/address.entity";
import User, { IUser } from "../model/user.entity";


export function mapToAddress(addressModel: AddressDto): IAddress {
    return new Address({
        address: addressModel.address,
        city: addressModel.city,
        lga: addressModel.lga,
        landmark: addressModel.landmark,
        state: addressModel.state,
    })
}

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
        address: mapToAddress(userModel.address),
        isCreatingAccount: userModel.isCreatingAccount,
        isCreatingBvn: userModel.isCreatingBvn
    })
}