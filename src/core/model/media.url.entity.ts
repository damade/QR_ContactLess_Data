import { Schema, Types, model, Document } from 'mongoose';

export interface IMediaUrl extends Document {
    url: string;
    mediaUrlType: MediaUrlType;
}

export enum MediaUrlType{
    Image,
    Video
}

const mediaUrlSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    mediaUrlType: {
        type: MediaUrlType,
        required: true,
        default: MediaUrlType.Image,
        enum: MediaUrlType
    },
},
    { timestamps: true });

const MediaUrl = model<IMediaUrl>('MediaUrl', mediaUrlSchema);

export default MediaUrl;