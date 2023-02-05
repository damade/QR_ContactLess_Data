import { mapToAddress } from "src/modules/users/mapper/user.mapper";
import User, { IUser } from "src/modules/users/model/user.entity";
import { BvnDto } from "../dto/bvn.dto";
import Bvn, { IBvn } from "../model/bvn.entity";


export function mapToBvn(bvnModel: BvnDto): IBvn {
    return new Bvn({
        occupation: bvnModel.occupation,
        language: bvnModel.language,
        userId: bvnModel.userId,
        bvn: bvnModel.bvn
    })
}

export function mapToUserFromBvn(bvnModel: BvnDto): IUser {
    return new User({
        uniqueId: bvnModel.bankProfile.user.uniqueId,
        phoneNumber: bvnModel.bankProfile.user.phoneNumber,
        email: bvnModel.bankProfile.user.email,
        title: bvnModel.bankProfile.user.title,
        firstName: bvnModel.bankProfile.user.firstName,
        lastName: bvnModel.bankProfile.user.lastName,
        middleName: bvnModel.bankProfile.user.middleName,
        fullName: bvnModel.bankProfile.user.fullName,
        dateOfBirth: bvnModel.bankProfile.user.dateOfBirth,
        gender: bvnModel.bankProfile.user.gender,
        stateOfOrigin: bvnModel.bankProfile.user.stateOfOrigin,
        lgaOfOrigin: bvnModel.bankProfile.user.lgaOfOrigin,
        placeOfBirth: bvnModel.bankProfile.user.placeOfBirth,
        nationality: bvnModel.bankProfile.user.nationality,
        maritalStatus: bvnModel.bankProfile.user.maritalStatus,
        identitifcationType: bvnModel.bankProfile.user.identificationType,
        idCardNo: bvnModel.bankProfile.user.idCardNo,
        signatureUrl: bvnModel.bankProfile.user.signatureUrl,
        password: bvnModel.bankProfile.user.password,
        address: mapToAddress(bvnModel.bankProfile.user.address),
        isCreatingAccount: bvnModel.bankProfile.user.isCreatingAccount,
        isCreatingBvn: bvnModel.bankProfile.user.isCreatingBvn
    })
}