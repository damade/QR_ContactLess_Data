import { Schema, Types, model, Document } from 'mongoose';

export interface IApiKeys extends Document {
    api_key: string;
    platform: Platform;
}

export enum Platform {
    Mobile = "Mobile",
    Web = "Web",
}

const apiKeySchema = new Schema({
    api_key: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
        default: Platform.Web,
        enum: Platform
    },
},
    { timestamps: true });

apiKeySchema.index({updatedAt: 1},{expireAfterSeconds: 48 * 3600})

const ApiKeys = model<IApiKeys>('ApiKeys', apiKeySchema);

export default ApiKeys;