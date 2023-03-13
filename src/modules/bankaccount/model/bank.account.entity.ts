import { Schema, Types, model, Document } from 'mongoose';
import { AccountType, NextOfKinRelationship } from 'src/core/constants';

export interface IBankAccount extends Document {
    motherMaidenName: string;
    taxIdentificationNumber?: string;
    bvn: string;
    bvnIndex: string;
    nin: string;
    ninIndex: string;
    userImage: string;
    accountType: string;
    nextOfKinFullName: string;
    nextOfKinAddress: string;
    nextOfKinEmail: string;
    nextOfKinPhoneNumber: string;
    nextOfKinRelationship: string;
    walletBalance?: number;
    isProfileComplete?: boolean;
    userId: string;
}

const bankAccountSchema = new Schema({
    motherMaidenName: {
        type: String,
        required: true
    },
    taxIdentificationNumber: {
        type: String,
        required: false
    },
    bvn: {
        type: String,
        required: true
    },
    bvnIndex: {
        type: String,
        required: true
    },
    nin: {
        type: String,
        required: true
    },
    ninIndex: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    nextOfKinRelationship: {
        type: String,
        required: true,
        enum: NextOfKinRelationship
    },
    accountType: {
        type: String,
        required: true,
        enum: AccountType
    },
    nextOfKinFullName: {
        type: String,
        required: true
    },
    nextOfKinAddress: {
        type: String,
        required: true
    },
    nextOfKinEmail: {
        type: String,
        required: true
    },
    nextOfKinPhoneNumber: {
        type: String,
        required: true
    },
    walletBalance: {
        type: Number,
        required: false,
        default: 0
    },
    userId:{
        type:Schema.Types.ObjectId, ref:'User',
        required: true
     },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true });

const BankAccount = model<IBankAccount>('BankAccount', bankAccountSchema);

export default BankAccount;