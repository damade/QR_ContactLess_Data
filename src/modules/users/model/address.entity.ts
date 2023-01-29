import { Schema, model, Document } from 'mongoose';

export interface IAddress extends Document {
    address: string;
    landmark: string;
    city: string;
    lga: string;
    state: string;
}

const addressSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    lga: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
    },
    state: {
        type: String,
        required: true,
    },
})

const Address = model<IAddress>('Address', addressSchema);

export default Address;
