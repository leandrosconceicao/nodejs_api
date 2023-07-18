import mongoose from "mongoose";

const establishmentsSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Parametro (name) é obrigatório"] },
    createDate: {type: Date, default: new Date()},
    location: {type: String, default: ""},   
    isOpen: {type: Boolean, default: false},
    ownerId: {type: String, required: [true, "Parametro (ownerId) é obrigatório"]},
    logo: {type: String, default: ""},
    url: {type: String, default: ""},
}, {
    versionKey: false,
})

const establishments = mongoose.model('establishments', establishmentsSchema);

export default establishments;