import { Schema, Types, model, Document } from 'mongoose';
import { Tenure } from 'src/core/constants';
import { LoanTierGroup } from './loan.tier.entity';

export interface ILoanRate extends Document {
    uniqueId: string;
    tenure : Tenure;
    loanType: LoanType;
    rate: number;
    isCustom: boolean;
    isAvailableToAllTiers: boolean;
    tiersAvailable: LoanTierGroup[]
}

export enum LoanType{
    Personal = "Personal",
    Business = "Business",
    Custom = "Custom"
}

const loanRateSchema = new Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    tenure: {
        type: String,
        required: true,
        default: Tenure.NONE,
        enum: Tenure
    },
    loanType: {
        type: String,
        required: true,
        default: LoanType.Personal,
        enum: LoanType
    },
    rate: {
        type: Number,
        required: true
    },
    isCustom: {
        type: Boolean,
        default: false,
        required: true
    },
    isAvailableToAllTiers: {
        type: Boolean,
        default: true,
    },
    tiersAvailable: {
        type: Array,
        default: undefined
    }
},
    { timestamps: true });

const LoanRate = model<ILoanRate>('LoanRate', loanRateSchema);

export default LoanRate;