import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
    // _id: { type: String },
    cgc: {type: String, required: true, unique: true},
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, select: false},
    isValid: { type: Boolean, default: undefined},
    phoneNumber: { type: String },
    passwordResetToken: {type: String, select: false},
    passwordResetExpires: {type: Date, select: false},
    establishments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "establishments"
    }],
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
