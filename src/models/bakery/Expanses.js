import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    _id: {type: String},
    storeCode: {type: String, required: true},
    description: {type: String, required: true},
    value: {type: mongoose.Types.Decimal128, default: 0},
    createdAt: {type: Date, default: new Date()},
})

const BakeryExpanse = mongoose.model('bakeryExpanse', configSchema)

export default BakeryExpanse;

