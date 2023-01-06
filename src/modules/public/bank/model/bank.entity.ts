import { Schema, model, Document } from 'mongoose';

export interface IBank extends Document {
    bank: string;
    bankCode: string;
    bankShortName: string;
}

const bankSchema = new Schema({
    bank: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    bankCode: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    bankShortName: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
},
    { timestamps: true });

const Bank = model<IBank>('Bank', bankSchema);

export default Bank;