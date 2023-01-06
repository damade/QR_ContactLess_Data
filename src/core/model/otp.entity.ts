import { Schema, Types, model, Document } from 'mongoose';

export interface IOtp extends Document {
    mobile_number: string;
    email: string;
    otp: string;
    expires: Date;
    blacklisted: boolean;
}

const otpSchema = new Schema({
    mobile_number: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    otp: {
        type: String,
        required: true,
        index: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true });

otpSchema.index({updatedAt: 1},{expireAfterSeconds: 24 * 3600})

const Otp = model<IOtp>('Otp', otpSchema);

export default Otp;