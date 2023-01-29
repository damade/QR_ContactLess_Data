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
        uniqueId: bvnModel.user.uniqueId,
        phoneNumber: bvnModel.user.phoneNumber,
        email: bvnModel.user.email,
        title: bvnModel.user.title,
        firstName: bvnModel.user.firstName,
        lastName: bvnModel.user.lastName,
        middleName: bvnModel.user.middleName,
        fullName: bvnModel.user.fullName,
        dateOfBirth: bvnModel.user.dateOfBirth,
        gender: bvnModel.user.gender,
        stateOfOrigin: bvnModel.user.stateOfOrigin,
        lgaOfOrigin: bvnModel.user.lgaOfOrigin,
        placeOfBirth: bvnModel.user.placeOfBirth,
        nationality: bvnModel.user.nationality,
        maritalStatus: bvnModel.user.maritalStatus,
        identitifcationType: bvnModel.user.identificationType,
        idCardNo: bvnModel.user.idCardNo,
        signatureUrl: bvnModel.user.signatureUrl,
        password: bvnModel.user.password,
        address: mapToAddress(bvnModel.user.address),
        isCreatingAccount: bvnModel.user.isCreatingAccount,
        isCreatingBvn: bvnModel.user.isCreatingBvn
    })
}