import { Schema, model, Document } from 'mongoose';
import { BankBranch, Gender, Title } from 'src/core/constants';

export interface IAdminUser extends Document {
    uniqueId: string;
    phoneNumber: string;
    email: string;
    title: Title;
    firstName: string;
    lastName: string;
    fullName: string;
    staffId: string;
    gender: Gender;
    bankBranch: BankBranch;
    password: string;
    bearerToken?: string
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
    fullName: {
        type: String,
        required: true
    },
    staffId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: Gender
    },
    bankBranch: {
        type: String,
        required: true,
        enum: BankBranch
    },
    password: {
        type: String,
        required: true
    },
    bearerToken: {
        type: String,
        required: false
    },
},
    { timestamps: true});

const AdminUser = model<IAdminUser>('AdminUser', userSchema);

export default AdminUser;