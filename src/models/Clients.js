import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
    _id: { type: String },
    cgc: {type: String, required: true, unique: true},
    name: { type: String },
    email: { type: String, required: true, unique: true},
    password: { type: String},
    isValid: { type: Boolean, default: undefined},
    phoneNumber: { type: String },
    address: {
        type: [{
                id: String,
                address: String,
                city: String,
                complement: String,
                distric: String,
                number: String,
                state: String,
                zipCode: String,
            }],
        _id: false,
        default: undefined,
        version: false,
    },
    version: false,
})

const clients = mongoose.model('clients', clientsSchema)

export default clients;
