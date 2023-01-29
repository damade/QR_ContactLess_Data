import { Schema, Types, model, Document } from 'mongoose';

export interface IBankAccount extends Document {
    motherMaidenName: string;
    taxIdentificationNumber?: string;
    bvn: string;
    bvnIndex: string;
    nin: string;
    ninIndex: string;
    userImage: string;
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