import { Schema, Types, model, Document } from 'mongoose';

export interface ILoanTier extends Document {
    loanTier : LoanTierGroup;
    minRange: number;
    maxRange: number;
    isCustom: boolean;
}

export enum LoanTierGroup{
    None,
    Tier0,
    Tier1,
    Tier2,
    Tier3,
    Tier4,
    Tier5,
    Custom
}

const loanTierSchema = new Schema({
    loanTier: {
        type: String,
        required: true,
        unique: true,
        default: LoanTierGroup.None,
        enum: LoanTierGroup
    },
    minRange: {
        type: Number,
        required: true,
    },
    maxRange: {
        type: Number,
        required: true,
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true });

const LoanTier = model<ILoanTier>('LoanTier', loanTierSchema);

export default LoanTier;