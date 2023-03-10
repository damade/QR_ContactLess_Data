import { Schema, model, Document } from 'mongoose';

export interface IBvn extends Document {
    occupation: string;
    language?: string
    isApproved?: boolean;
    bvn: string;
    userId: string;
}

const bvnSchema = new Schema({
    occupation: {
        type: String,
        required: true
    },
    language: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    bvn: {
        type: String,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId, ref:'User',
        required: true
     },
},
    { timestamps: true });

const Bvn = model<IBvn>('Bvn', bvnSchema);

export default Bvn;