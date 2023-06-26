import mongoose from "mongoose";

const establishmentsSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Parametro (name) é obrigatório"] },
    createDate: {type: Date, default: new Date()},
    location: {type: String, default: ""},   
    isOpen: {type: Boolean, default: false},
    ownerId: {type: String, unique: true, required: [true, "Parametro (ownerId) é obrigatório"]},
    logo: {type: String},
    url: {type: String},
}, {
    versionKey: false,
})

const establishments = mongoose.model('establishments', establishmentsSchema);

export default establishments;