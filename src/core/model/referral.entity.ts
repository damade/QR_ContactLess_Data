import { Schema, model, Document } from 'mongoose';

export interface IReferralCode extends Document {
    code: string;
}

const referralCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
    }
},
    { timestamps: true });

const ReferralCode = model<IReferralCode>('Referral', referralCodeSchema);

export default ReferralCode;