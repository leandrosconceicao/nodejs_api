import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    _id: {type: Number},
    isActive: {type: Boolean, required: true},
    categoria: {type: String},
    categoryId: {type: Number},
    preco: {type: Number},
    produto: {type: String, required: true},
    descricao: {type: String},
    preparacao: Boolean,
    storeCode: {type: String, required: true},
    addOnes: {type: Array},
});

const products = mongoose.model('produtos', productSchema)

export default products;
