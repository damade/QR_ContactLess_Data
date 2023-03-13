import { Schema, model, Document } from 'mongoose';
import { Gender, IDENTIFICATION_TYPE, MARITAL_STATUS, Title } from 'src/core/constants';

export interface IUser extends Document {
    uniqueId: string;
    phoneNumber: string;
    email: string;
    title: Title;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    dateOfBirth: Date;
    gender: Gender;
    stateOfOrigin: string;
    lgaOfOrigin: string;
    placeOfBirth: string;
    nationality: string;
    maritalStatus: MARITAL_STATUS;
    identitifcationType: IDENTIFICATION_TYPE;
    idCardNo: string;
    signatureUrl: string;
    password: string;
    isCreatingBvn?: boolean;
    bearerToken?: string
    isCreatingAccount?: boolean;
    address: string;
    landmark: string;
    city: string;
    lga: string;
    state: string;
    hasAccountBeenApproved?: boolean;
    hasBvnBeenApproved?: boolean;
    shouldSignatureImageBeReuploaded?: boolean;
    shouldProfileImageBeReuploaded?: boolean;
    rejectionComment?: string; 
}

const userSchema = new Schema({
    uniqueId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: Title
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: Gender
    },
    stateOfOrigin: {
        type: String,
        required: true
    },
    lgaOfOrigin: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    
    maritalStatus: {
        type: String,
        required: true,
        enum: MARITAL_STATUS
    },
    identitifcationType: {
        type: String,
        required: true,
        enum: IDENTIFICATION_TYPE
    },
    idCardNo: {
        type: String,
        required: true
    },
    signatureUrl: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bearerToken: {
        type: String,
        required: false

    },
    rejectionComment: {
        type: String,
        required: false,
        default: " "
    },
    isCreatingBvn: {
        type: Boolean,
        required: false,
        default: false
    },
    hasBvnBeenApproved: {
        type: Boolean,
        required: false,
        default: false
    },
    isCreatingAccount: {
        type: Boolean,
        required: false,
        default: false
    },
    hasAccountBeenApproved: {
        type: Boolean,
        required: false,
        default: false,
    },
    shouldSignatureImageBeReuploaded: {
        type: Boolean,
        required: false,
        default: false,
    },
    shouldProfileImageBeReuploaded: {
        type: Boolean,
        required: false,
        default: false,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    lga: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
    },
    state: {
        type: String,
        required: true,
    },
},
    { timestamps: true});

const User = model<IUser>('User', userSchema);

export default User;