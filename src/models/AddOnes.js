import mongoose from "mongoose";

const addOneSchema = new mongoose.Schema({
    _id: {type: String},
    storeCode: {type: String},
    maxQuantityAllowed: {type: Number},
    name: {type: String},
    price: {type: Number},
    isRequired: {type: Boolean},
});

const addOnes = mongoose.model('addOnes', addOneSchema)

export default addOnes;
