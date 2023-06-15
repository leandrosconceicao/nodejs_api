import mongoose from "mongoose";
import TokenGenerator from "../utils/tokenGenerator.js";

const establishmentsSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Parametro (name) é obrigatório"] },
    createDate: {type: Date, default: new Date()},
    stores: {
        type: [
            new mongoose.Schema({
            _id: {type: String, default: TokenGenerator.generateId()},
            createDate: {type: Date, default: new Date()},
            location: {type: String, default: ""},   
            url: {type: String, default: ""},
            isOpen: {type: Boolean, default: false},
        })
    ],
        default: []
    },
    ownerId: {type: String, unique: true, required: [true, "Parametro (ownerId) é obrigatório"]},
    logo: {type: String},
}, {
    versionKey: false,
})

const establishments = mongoose.model('establishments', establishmentsSchema);

export default establishments;